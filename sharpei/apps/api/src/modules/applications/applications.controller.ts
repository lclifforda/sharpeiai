import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  SupabaseAuthGuard,
  AuthUser,
} from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('applications')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private service: ApplicationsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.service.findAll(user.org_id, user.vendor_id);
  }

  @Get('stats')
  @Roles('admin', 'manager', 'viewer')
  getStats(@CurrentUser() user: AuthUser) {
    return this.service.getStats(user.org_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.findOne(id, user.org_id);
  }

  @Post()
  @Roles('admin', 'manager', 'vendor')
  create(@Body() body: any, @CurrentUser() user: AuthUser) {
    return this.service.create(body, user.org_id);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  update(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.update(id, body, user.org_id);
  }

  @Patch(':id/status')
  @Roles('admin', 'manager')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.updateStatus(id, status, user.org_id);
  }

  @Patch(':id/assign')
  @Roles('admin', 'manager')
  assign(
    @Param('id') id: string,
    @Body('assigned_to') assignedTo: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.assign(id, assignedTo, user.org_id);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.delete(id, user.org_id);
  }
}
