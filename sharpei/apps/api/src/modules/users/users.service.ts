import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE } from '../../common/modules/drizzle.module';
import { users } from '@sharpei/db';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: any) {}

  async findAll(orgId: string) {
    return this.db
      .select()
      .from(users)
      .where(eq(users.org_id, orgId));
  }

  async findOne(id: string, orgId: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.org_id, orgId)))
      .limit(1);

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: any, orgId: string) {
    const [user] = await this.db
      .update(users)
      .set({ ...data, updated_at: new Date() })
      .where(and(eq(users.id, id), eq(users.org_id, orgId)))
      .returning();

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deactivate(id: string, orgId: string) {
    return this.update(id, { is_active: false }, orgId);
  }
}
