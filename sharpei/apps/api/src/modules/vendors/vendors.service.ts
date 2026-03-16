import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { DRIZZLE } from '../../common/modules/drizzle.module';
import { vendors } from '@sharpei/db';

@Injectable()
export class VendorsService {
  constructor(@Inject(DRIZZLE) private db: any) {}

  async findAll(orgId: string) {
    return this.db
      .select()
      .from(vendors)
      .where(eq(vendors.org_id, orgId))
      .orderBy(desc(vendors.created_at));
  }

  async findOne(id: string, orgId: string) {
    const [vendor] = await this.db
      .select()
      .from(vendors)
      .where(and(eq(vendors.id, id), eq(vendors.org_id, orgId)))
      .limit(1);

    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async create(data: any, orgId: string) {
    const [vendor] = await this.db
      .insert(vendors)
      .values({ ...data, org_id: orgId })
      .returning();
    return vendor;
  }

  async update(id: string, data: any, orgId: string) {
    const [vendor] = await this.db
      .update(vendors)
      .set({ ...data, updated_at: new Date() })
      .where(and(eq(vendors.id, id), eq(vendors.org_id, orgId)))
      .returning();

    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async activate(id: string, orgId: string) {
    return this.update(id, { status: 'active', activated_at: new Date() }, orgId);
  }

  async suspend(id: string, orgId: string) {
    return this.update(id, { status: 'suspended' }, orgId);
  }

  async delete(id: string, orgId: string) {
    const [vendor] = await this.db
      .delete(vendors)
      .where(and(eq(vendors.id, id), eq(vendors.org_id, orgId)))
      .returning();

    if (!vendor) throw new NotFoundException('Vendor not found');
    return { deleted: true };
  }
}
