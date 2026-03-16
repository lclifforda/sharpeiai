import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { eq, and } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { DRIZZLE } from '../../common/modules/drizzle.module';
import { SUPABASE_ADMIN } from '../../common/modules/supabase.module';
import { orgs, users, invitations } from '@sharpei/db';
import type {
  SignupInput,
  LoginInput,
  InviteUserInput,
  AcceptInviteInput,
} from '@sharpei/shared';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: any,
    @Inject(SUPABASE_ADMIN) private supabase: SupabaseClient,
  ) {}

  async signup(input: SignupInput) {
    // 1. Create Supabase auth user
    const { data: authData, error: authError } =
      await this.supabase.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
      });

    if (authError) {
      if (authError.message?.includes('already')) {
        throw new ConflictException('Email already registered');
      }
      throw new Error(`Auth error: ${authError.message}`);
    }

    const authUserId = authData.user.id;

    // 2. Create org
    const slug = input.orgName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const [org] = await this.db
      .insert(orgs)
      .values({
        name: input.orgName,
        slug,
      })
      .returning();

    // 3. Create public user record
    const [user] = await this.db
      .insert(users)
      .values({
        id: authUserId,
        org_id: org.id,
        email: input.email,
        name: input.name,
        role: 'admin',
        initials: input.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      })
      .returning();

    // 4. Set app_metadata on auth user (baked into JWT for RLS)
    await this.supabase.auth.admin.updateUserById(authUserId, {
      app_metadata: {
        org_id: org.id,
        role: 'admin',
        vendor_id: null,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        org_id: user.org_id,
      },
      org: {
        id: org.id,
        name: org.name,
        slug: org.slug,
      },
    };
  }

  async login(input: LoginInput) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Fetch public user record
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, data.user.id))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('User profile not found');
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        org_id: user.org_id,
        vendor_id: user.vendor_id,
      },
    };
  }

  async getMe(userId: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [org] = await this.db
      .select()
      .from(orgs)
      .where(eq(orgs.id, user.org_id))
      .limit(1);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        initials: user.initials,
        role: user.role,
        org_id: user.org_id,
        vendor_id: user.vendor_id,
        is_active: user.is_active,
        created_at: user.created_at,
      },
      org: org
        ? {
            id: org.id,
            name: org.name,
            slug: org.slug,
            branding: org.branding,
            settings: org.settings,
          }
        : null,
    };
  }

  async inviteUser(input: InviteUserInput, invitedByUserId: string, orgId: string) {
    // Check if user already exists in this org
    const existing = await this.db
      .select()
      .from(users)
      .where(and(eq(users.org_id, orgId), eq(users.email, input.email)))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('User already exists in this organization');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const [invitation] = await this.db
      .insert(invitations)
      .values({
        org_id: orgId,
        email: input.email,
        role: input.role,
        vendor_id: input.vendor_id || null,
        token,
        expires_at: expiresAt,
        invited_by: invitedByUserId,
      })
      .returning();

    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      token: invitation.token,
      expires_at: invitation.expires_at,
    };
  }

  async validateInvite(token: string) {
    const [invitation] = await this.db
      .select()
      .from(invitations)
      .where(eq(invitations.token, token))
      .limit(1);

    if (!invitation) {
      throw new NotFoundException('Invalid invitation token');
    }

    if (invitation.accepted_at) {
      throw new ConflictException('Invitation already accepted');
    }

    if (new Date(invitation.expires_at) < new Date()) {
      throw new ConflictException('Invitation has expired');
    }

    // Fetch org name for display
    const [org] = await this.db
      .select({ name: orgs.name })
      .from(orgs)
      .where(eq(orgs.id, invitation.org_id))
      .limit(1);

    return {
      email: invitation.email,
      role: invitation.role,
      org_name: org?.name ?? 'Unknown',
      expires_at: invitation.expires_at,
    };
  }

  async acceptInvite(input: AcceptInviteInput) {
    // Find invitation
    const [invitation] = await this.db
      .select()
      .from(invitations)
      .where(eq(invitations.token, input.token))
      .limit(1);

    if (!invitation) {
      throw new NotFoundException('Invalid invitation token');
    }

    if (invitation.accepted_at) {
      throw new ConflictException('Invitation already accepted');
    }

    if (new Date(invitation.expires_at) < new Date()) {
      throw new ConflictException('Invitation has expired');
    }

    // Create Supabase auth user
    const { data: authData, error: authError } =
      await this.supabase.auth.admin.createUser({
        email: invitation.email,
        password: input.password,
        email_confirm: true,
      });

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`);
    }

    // Create public user record
    const [user] = await this.db
      .insert(users)
      .values({
        id: authData.user.id,
        org_id: invitation.org_id,
        email: invitation.email,
        name: input.name,
        role: invitation.role,
        vendor_id: invitation.vendor_id,
        initials: input.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      })
      .returning();

    // Set app_metadata on auth user (baked into JWT for RLS)
    await this.supabase.auth.admin.updateUserById(authData.user.id, {
      app_metadata: {
        org_id: invitation.org_id,
        role: invitation.role,
        vendor_id: invitation.vendor_id || null,
      },
    });

    // Mark invitation as accepted
    await this.db
      .update(invitations)
      .set({ accepted_at: new Date() })
      .where(eq(invitations.id, invitation.id));

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        org_id: user.org_id,
        vendor_id: user.vendor_id,
      },
    };
  }
}
