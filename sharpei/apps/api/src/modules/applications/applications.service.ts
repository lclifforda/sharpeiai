import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc, sql } from 'drizzle-orm';
import { DRIZZLE } from '../../common/modules/drizzle.module';
import {
  applications,
  customers,
  vendors,
  users,
} from '@sharpei/db';

@Injectable()
export class ApplicationsService {
  constructor(@Inject(DRIZZLE) private db: any) {}

  async findAll(orgId: string, vendorId: string | null) {
    const conditions = [eq(applications.org_id, orgId)];
    if (vendorId) {
      conditions.push(eq(applications.vendor_id, vendorId));
    }

    return this.db
      .select()
      .from(applications)
      .where(and(...conditions))
      .orderBy(desc(applications.created_at));
  }

  async findOne(id: string, orgId: string) {
    const [app] = await this.db
      .select()
      .from(applications)
      .where(and(eq(applications.id, id), eq(applications.org_id, orgId)))
      .limit(1);

    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async create(data: any, orgId: string) {
    const [app] = await this.db
      .insert(applications)
      .values({ ...data, org_id: orgId })
      .returning();
    return app;
  }

  async update(id: string, data: any, orgId: string) {
    const [app] = await this.db
      .update(applications)
      .set({ ...data, updated_at: new Date() })
      .where(and(eq(applications.id, id), eq(applications.org_id, orgId)))
      .returning();

    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async updateStatus(id: string, status: string, orgId: string) {
    return this.update(
      id,
      {
        status,
        ...(status === 'submitted' ? { submitted_at: new Date() } : {}),
      },
      orgId,
    );
  }

  async assign(id: string, assignedTo: string, orgId: string) {
    return this.update(id, { assigned_to: assignedTo }, orgId);
  }

  async delete(id: string, orgId: string) {
    const [app] = await this.db
      .delete(applications)
      .where(and(eq(applications.id, id), eq(applications.org_id, orgId)))
      .returning();

    if (!app) throw new NotFoundException('Application not found');
    return { deleted: true };
  }

  async getStats(orgId: string) {
    const result = await this.db
      .select({
        total: sql<number>`count(*)::int`,
        draft: sql<number>`count(*) filter (where ${applications.status} = 'draft')::int`,
        submitted: sql<number>`count(*) filter (where ${applications.status} = 'submitted')::int`,
        in_review: sql<number>`count(*) filter (where ${applications.status} = 'in_review')::int`,
        approved: sql<number>`count(*) filter (where ${applications.status} = 'approved')::int`,
        funded: sql<number>`count(*) filter (where ${applications.status} = 'funded')::int`,
        declined: sql<number>`count(*) filter (where ${applications.status} = 'declined')::int`,
        total_amount: sql<string>`coalesce(sum(${applications.amount}), 0)`,
      })
      .from(applications)
      .where(eq(applications.org_id, orgId));

    return result[0];
  }
}
