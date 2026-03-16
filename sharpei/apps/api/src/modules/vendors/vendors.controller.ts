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
import { VendorsService } from './vendors.service';
import {
  SupabaseAuthGuard,
  AuthUser,
} from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('vendors')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('admin', 'manager', 'viewer')
export class VendorsController {
  constructor(private service: VendorsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.service.findAll(user.org_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.findOne(id, user.org_id);
  }

  @Post()
  @Roles('admin', 'manager')
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

  @Patch(':id/activate')
  @Roles('admin', 'manager')
  activate(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.activate(id, user.org_id);
  }

  @Patch(':id/suspend')
  @Roles('admin')
  suspend(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.suspend(id, user.org_id);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.delete(id, user.org_id);
  }
}
