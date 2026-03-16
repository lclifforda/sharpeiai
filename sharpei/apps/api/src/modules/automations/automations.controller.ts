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
import { AutomationsService } from './automations.service';
import {
  SupabaseAuthGuard,
  AuthUser,
} from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('automations')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('admin', 'manager', 'viewer')
export class AutomationsController {
  constructor(private service: AutomationsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.service.findAll(user.org_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.findOne(id, user.org_id);
  }

  @Get(':id/executions')
  getExecutions(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.getExecutions(id, user.org_id);
  }

  @Post()
  @Roles('admin', 'manager')
  create(@Body() body: any, @CurrentUser() user: AuthUser) {
    return this.service.create(body, user.org_id, user.id);
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

  @Patch(':id/toggle')
  @Roles('admin', 'manager')
  toggleStatus(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.toggleStatus(id, user.org_id);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.delete(id, user.org_id);
  }
}
