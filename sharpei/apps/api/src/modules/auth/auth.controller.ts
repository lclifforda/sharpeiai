import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard, AuthUser } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  signupSchema,
  loginSchema,
  inviteUserSchema,
  acceptInviteSchema,
} from '@sharpei/shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signupSchema))
  signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getMe(@CurrentUser() user: AuthUser) {
    return this.authService.getMe(user.id);
  }

  @Post('invite')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin')
  @UsePipes(new ZodValidationPipe(inviteUserSchema))
  invite(@Body() body: any, @CurrentUser() user: AuthUser) {
    return this.authService.inviteUser(body, user.id, user.org_id);
  }

  @Get('invite/:token')
  validateInvite(@Param('token') token: string) {
    return this.authService.validateInvite(token);
  }

  @Post('accept-invite')
  @UsePipes(new ZodValidationPipe(acceptInviteSchema))
  acceptInvite(@Body() body: any) {
    return this.authService.acceptInvite(body);
  }
}
