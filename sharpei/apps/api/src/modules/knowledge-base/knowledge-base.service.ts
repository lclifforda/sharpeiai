import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { SupabaseClient } from '@supabase/supabase-js';
import { DRIZZLE } from '../../common/modules/drizzle.module';
import { SUPABASE_ADMIN } from '../../common/modules/supabase.module';
import { knowledgeBase } from '@sharpei/db';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @Inject(DRIZZLE) private db: any,
    @Inject(SUPABASE_ADMIN) private supabase: SupabaseClient,
  ) {}

  async findAll(orgId: string) {
    return this.db
      .select()
      .from(knowledgeBase)
      .where(eq(knowledgeBase.org_id, orgId))
      .orderBy(desc(knowledgeBase.created_at));
  }

  async findOne(id: string, orgId: string) {
    const [doc] = await this.db
      .select()
      .from(knowledgeBase)
      .where(and(eq(knowledgeBase.id, id), eq(knowledgeBase.org_id, orgId)))
      .limit(1);

    if (!doc) throw new NotFoundException('Knowledge base entry not found');
    return doc;
  }

  async create(data: any, orgId: string) {
    const [doc] = await this.db
      .insert(knowledgeBase)
      .values({ ...data, org_id: orgId })
      .returning();
    return doc;
  }

  async update(id: string, data: any, orgId: string) {
    const [doc] = await this.db
      .update(knowledgeBase)
      .set(data)
      .where(and(eq(knowledgeBase.id, id), eq(knowledgeBase.org_id, orgId)))
      .returning();

    if (!doc) throw new NotFoundException('Knowledge base entry not found');
    return doc;
  }

  async delete(id: string, orgId: string) {
    const doc = await this.findOne(id, orgId);

    // Delete from storage
    if (doc.storage_path) {
      await this.supabase.storage
        .from('knowledge-base')
        .remove([doc.storage_path]);
    }

    await this.db
      .delete(knowledgeBase)
      .where(and(eq(knowledgeBase.id, id), eq(knowledgeBase.org_id, orgId)));

    return { deleted: true };
  }
}
