import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { DRIZZLE } from '../../common/modules/drizzle.module';
import { customers } from '@sharpei/db';

@Injectable()
export class CustomersService {
  constructor(@Inject(DRIZZLE) private db: any) {}

  async findAll(orgId: string) {
    return this.db
      .select()
      .from(customers)
      .where(eq(customers.org_id, orgId))
      .orderBy(desc(customers.created_at));
  }

  async findOne(id: string, orgId: string) {
    const [customer] = await this.db
      .select()
      .from(customers)
      .where(and(eq(customers.id, id), eq(customers.org_id, orgId)))
      .limit(1);

    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(data: any, orgId: string) {
    const [customer] = await this.db
      .insert(customers)
      .values({ ...data, org_id: orgId })
      .returning();
    return customer;
  }

  async update(id: string, data: any, orgId: string) {
    const [customer] = await this.db
      .update(customers)
      .set({ ...data, updated_at: new Date() })
      .where(and(eq(customers.id, id), eq(customers.org_id, orgId)))
      .returning();

    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async delete(id: string, orgId: string) {
    const [customer] = await this.db
      .delete(customers)
      .where(and(eq(customers.id, id), eq(customers.org_id, orgId)))
      .returning();

    if (!customer) throw new NotFoundException('Customer not found');
    return { deleted: true };
  }
}
