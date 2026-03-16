import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../common/modules/drizzle.module';
import { orgs } from '@sharpei/db';

@Injectable()
export class OrgsService {
  constructor(@Inject(DRIZZLE) private db: any) {}

  async findOne(orgId: string) {
    const [org] = await this.db
      .select()
      .from(orgs)
      .where(eq(orgs.id, orgId))
      .limit(1);

    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(orgId: string, data: any) {
    const [org] = await this.db
      .update(orgs)
      .set({ ...data, updated_at: new Date() })
      .where(eq(orgs.id, orgId))
      .returning();

    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async updateBranding(orgId: string, branding: any) {
    return this.update(orgId, { branding });
  }

  async updateSettings(orgId: string, settings: any) {
    return this.update(orgId, { settings });
  }

  async updateAIConfig(orgId: string, aiConfig: any) {
    return this.update(orgId, { ai_config: aiConfig });
  }
}
