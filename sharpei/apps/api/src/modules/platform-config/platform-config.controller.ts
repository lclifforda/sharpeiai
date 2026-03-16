import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PlatformConfigService } from './platform-config.service';
import {
  SupabaseAuthGuard,
  AuthUser,
} from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('platform-config')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class PlatformConfigController {
  constructor(private service: PlatformConfigService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.service.findAll(user.org_id);
  }

  @Get(':typeId')
  findByType(@Param('typeId') typeId: string, @CurrentUser() user: AuthUser) {
    return this.service.findByType(typeId, user.org_id);
  }

  @Put(':typeId')
  @Roles('admin')
  upsert(
    @Param('typeId') typeId: string,
    @Body() body: any,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.upsert({ ...body, type_id: typeId }, user.org_id);
  }

  @Delete(':typeId')
  @Roles('admin')
  delete(@Param('typeId') typeId: string, @CurrentUser() user: AuthUser) {
    return this.service.delete(typeId, user.org_id);
  }
}
