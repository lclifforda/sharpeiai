import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import {
  SupabaseAuthGuard,
  AuthUser,
} from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('documents')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private service: DocumentsService) {}

  @Get()
  findByApplication(
    @Query('application_id') applicationId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.findByApplication(applicationId, user.org_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.findOne(id, user.org_id);
  }

  @Get(':id/url')
  getSignedUrl(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.getSignedUrl(id, user.org_id);
  }

  @Patch(':id/status')
  @Roles('admin', 'manager')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; extracted_data?: any },
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.updateStatus(
      id,
      body.status,
      user.org_id,
      body.extracted_data,
    );
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  delete(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.delete(id, user.org_id);
  }
}
