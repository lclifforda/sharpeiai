import { Module } from '@nestjs/common';
import { DrizzleModule } from './common/modules/drizzle.module';
import { SupabaseModule } from './common/modules/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrgsModule } from './modules/orgs/orgs.module';
import { UsersModule } from './modules/users/users.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { CustomersModule } from './modules/customers/customers.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AutomationsModule } from './modules/automations/automations.module';
import { PlatformConfigModule } from './modules/platform-config/platform-config.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';

@Module({
  imports: [
    DrizzleModule,
    SupabaseModule,
    AuthModule,
    OrgsModule,
    UsersModule,
    ApplicationsModule,
    CustomersModule,
    VendorsModule,
    DocumentsModule,
    DashboardModule,
    AutomationsModule,
    PlatformConfigModule,
    KnowledgeBaseModule,
    // Phase 4: AIModule
  ],
})
export class AppModule {}
