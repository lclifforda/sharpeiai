import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { SupabaseClient } from '@supabase/supabase-js';
import { DRIZZLE } from '../../common/modules/drizzle.module';
import { SUPABASE_ADMIN } from '../../common/modules/supabase.module';
import { documents } from '@sharpei/db';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(DRIZZLE) private db: any,
    @Inject(SUPABASE_ADMIN) private supabase: SupabaseClient,
  ) {}

  async findByApplication(applicationId: string, orgId: string) {
    return this.db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.application_id, applicationId),
          eq(documents.org_id, orgId),
        ),
      )
      .orderBy(desc(documents.created_at));
  }

  async findOne(id: string, orgId: string) {
    const [doc] = await this.db
      .select()
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.org_id, orgId)))
      .limit(1);

    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async upload(
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    metadata: {
      org_id: string;
      application_id?: string;
      customer_id?: string;
      document_type: string;
      uploaded_by: string;
    },
  ) {
    const storagePath = `${metadata.org_id}/${metadata.application_id || 'general'}/${Date.now()}-${file.originalname}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await this.supabase.storage
      .from('documents')
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Create document record
    const [doc] = await this.db
      .insert(documents)
      .values({
        org_id: metadata.org_id,
        application_id: metadata.application_id || null,
        customer_id: metadata.customer_id || null,
        document_type: metadata.document_type,
        file_name: file.originalname,
        storage_path: storagePath,
        file_size: file.size,
        mime_type: file.mimetype,
        uploaded_by: metadata.uploaded_by,
        status: 'pending',
      })
      .returning();

    return doc;
  }

  async getSignedUrl(id: string, orgId: string) {
    const doc = await this.findOne(id, orgId);

    const { data, error } = await this.supabase.storage
      .from('documents')
      .createSignedUrl(doc.storage_path, 3600); // 1 hour

    if (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }

    return { url: data.signedUrl, expires_in: 3600 };
  }

  async updateStatus(id: string, status: string, orgId: string, extractedData?: any) {
    const updateData: any = { status };
    if (extractedData) {
      updateData.extracted_data = extractedData;
    }

    const [doc] = await this.db
      .update(documents)
      .set(updateData)
      .where(and(eq(documents.id, id), eq(documents.org_id, orgId)))
      .returning();

    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async delete(id: string, orgId: string) {
    const doc = await this.findOne(id, orgId);

    // Delete from storage
    await this.supabase.storage.from('documents').remove([doc.storage_path]);

    // Delete record
    await this.db
      .delete(documents)
      .where(and(eq(documents.id, id), eq(documents.org_id, orgId)));

    return { deleted: true };
  }
}
