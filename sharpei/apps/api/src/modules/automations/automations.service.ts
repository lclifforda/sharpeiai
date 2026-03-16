import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { DRIZZLE } from '../../common/modules/drizzle.module';
import { automations, automationExecutions } from '@sharpei/db';

@Injectable()
export class AutomationsService {
  constructor(@Inject(DRIZZLE) private db: any) {}

  async findAll(orgId: string) {
    return this.db
      .select()
      .from(automations)
      .where(eq(automations.org_id, orgId))
      .orderBy(desc(automations.created_at));
  }

  async findOne(id: string, orgId: string) {
    const [automation] = await this.db
      .select()
      .from(automations)
      .where(and(eq(automations.id, id), eq(automations.org_id, orgId)))
      .limit(1);

    if (!automation) throw new NotFoundException('Automation not found');
    return automation;
  }

  async create(data: any, orgId: string, userId: string) {
    const [automation] = await this.db
      .insert(automations)
      .values({ ...data, org_id: orgId, created_by: userId })
      .returning();
    return automation;
  }

  async update(id: string, data: any, orgId: string) {
    const [automation] = await this.db
      .update(automations)
      .set({ ...data, updated_at: new Date() })
      .where(and(eq(automations.id, id), eq(automations.org_id, orgId)))
      .returning();

    if (!automation) throw new NotFoundException('Automation not found');
    return automation;
  }

  async toggleStatus(id: string, orgId: string) {
    const automation = await this.findOne(id, orgId);
    const newStatus = automation.status === 'active' ? 'paused' : 'active';
    return this.update(id, { status: newStatus }, orgId);
  }

  async delete(id: string, orgId: string) {
    const [automation] = await this.db
      .delete(automations)
      .where(and(eq(automations.id, id), eq(automations.org_id, orgId)))
      .returning();

    if (!automation) throw new NotFoundException('Automation not found');
    return { deleted: true };
  }

  async getExecutions(automationId: string, orgId: string) {
    return this.db
      .select()
      .from(automationExecutions)
      .where(
        and(
          eq(automationExecutions.automation_id, automationId),
          eq(automationExecutions.org_id, orgId),
        ),
      )
      .orderBy(desc(automationExecutions.created_at))
      .limit(50);
  }
}
