import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrgsService } from './orgs.service';
import {
  SupabaseAuthGuard,
  AuthUser,
} from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('orgs')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class OrgsController {
  constructor(private service: OrgsService) {}

  @Get('me')
  findOne(@CurrentUser() user: AuthUser) {
    return this.service.findOne(user.org_id);
  }

  @Patch('me')
  @Roles('admin')
  update(@Body() body: any, @CurrentUser() user: AuthUser) {
    return this.service.update(user.org_id, body);
  }

  @Patch('me/branding')
  @Roles('admin')
  updateBranding(@Body() body: any, @CurrentUser() user: AuthUser) {
    return this.service.updateBranding(user.org_id, body);
  }

  @Patch('me/settings')
  @Roles('admin')
  updateSettings(@Body() body: any, @CurrentUser() user: AuthUser) {
    return this.service.updateSettings(user.org_id, body);
  }

  @Patch('me/ai-config')
  @Roles('admin')
  updateAIConfig(@Body() body: any, @CurrentUser() user: AuthUser) {
    return this.service.updateAIConfig(user.org_id, body);
  }
}
