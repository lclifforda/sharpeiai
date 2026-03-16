import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE } from '../../common/modules/drizzle.module';
import { applicationTypesConfig } from '@sharpei/db';

@Injectable()
export class PlatformConfigService {
  constructor(@Inject(DRIZZLE) private db: any) {}

  async findAll(orgId: string) {
    return this.db
      .select()
      .from(applicationTypesConfig)
      .where(eq(applicationTypesConfig.org_id, orgId));
  }

  async findByType(typeId: string, orgId: string) {
    const [config] = await this.db
      .select()
      .from(applicationTypesConfig)
      .where(
        and(
          eq(applicationTypesConfig.type_id, typeId),
          eq(applicationTypesConfig.org_id, orgId),
        ),
      )
      .limit(1);

    if (!config) throw new NotFoundException('Config not found for this type');
    return config;
  }

  async upsert(data: any, orgId: string) {
    const existing = await this.db
      .select()
      .from(applicationTypesConfig)
      .where(
        and(
          eq(applicationTypesConfig.type_id, data.type_id),
          eq(applicationTypesConfig.org_id, orgId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      const [config] = await this.db
        .update(applicationTypesConfig)
        .set({ ...data, updated_at: new Date() })
        .where(eq(applicationTypesConfig.id, existing[0].id))
        .returning();
      return config;
    }

    const [config] = await this.db
      .insert(applicationTypesConfig)
      .values({ ...data, org_id: orgId })
      .returning();
    return config;
  }

  async delete(typeId: string, orgId: string) {
    const [config] = await this.db
      .delete(applicationTypesConfig)
      .where(
        and(
          eq(applicationTypesConfig.type_id, typeId),
          eq(applicationTypesConfig.org_id, orgId),
        ),
      )
      .returning();

    if (!config) throw new NotFoundException('Config not found');
    return { deleted: true };
  }
}
