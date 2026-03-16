import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../guards/supabase-auth.guard';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthUser = request.user;
    return data ? user?.[data] : user;
  },
);
