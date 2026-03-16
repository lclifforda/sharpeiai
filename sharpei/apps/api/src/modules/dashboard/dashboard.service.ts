import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DRIZZLE } from '../../common/modules/drizzle.module';
import {
  applications,
  customers,
  vendors,
  documents,
} from '@sharpei/db';

@Injectable()
export class DashboardService {
  constructor(@Inject(DRIZZLE) private db: any) {}

  async getStats(orgId: string) {
    const [appStats] = await this.db
      .select({
        total: sql<number>`count(*)::int`,
        this_month: sql<number>`count(*) filter (where created_at >= now() - interval '30 days')::int`,
        pending_review: sql<number>`count(*) filter (where status in ('submitted', 'in_review'))::int`,
        approved: sql<number>`count(*) filter (where status = 'approved')::int`,
        total_amount: sql<string>`coalesce(sum(amount), 0)`,
        approved_amount: sql<string>`coalesce(sum(amount) filter (where status in ('approved', 'funded')), 0)`,
      })
      .from(applications)
      .where(eq(applications.org_id, orgId));

    const [customerStats] = await this.db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where status = 'active')::int`,
      })
      .from(customers)
      .where(eq(customers.org_id, orgId));

    const [vendorStats] = await this.db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where status = 'active')::int`,
      })
      .from(vendors)
      .where(eq(vendors.org_id, orgId));

    const [docStats] = await this.db
      .select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where status = 'pending')::int`,
        verified: sql<number>`count(*) filter (where status = 'verified')::int`,
      })
      .from(documents)
      .where(eq(documents.org_id, orgId));

    return {
      applications: appStats,
      customers: customerStats,
      vendors: vendorStats,
      documents: docStats,
    };
  }

  async getFunnel(orgId: string) {
    const statuses = ['draft', 'submitted', 'in_review', 'approved', 'funded', 'declined'];

    const result = await this.db
      .select({
        status: applications.status,
        count: sql<number>`count(*)::int`,
        amount: sql<string>`coalesce(sum(${applications.amount}), 0)`,
      })
      .from(applications)
      .where(eq(applications.org_id, orgId))
      .groupBy(applications.status);

    const funnelMap = Object.fromEntries(result.map((r: any) => [r.status, r]));

    return statuses.map((status) => ({
      status,
      count: funnelMap[status]?.count || 0,
      amount: funnelMap[status]?.amount || '0',
    }));
  }
}
