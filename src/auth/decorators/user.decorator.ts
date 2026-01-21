import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../interface/authenticated-request.interface';

export const User = createParamDecorator(
  (
    key: keyof AuthenticatedRequest['user'] | undefined,
    ctx: ExecutionContext,
  ) => {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('user not authentication');
    }

    return key ? user[key] : user;
  },
);
