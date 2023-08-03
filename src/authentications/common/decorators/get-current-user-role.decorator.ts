import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const role = user ? user.role : 'USER';
    return role;
  },
);
