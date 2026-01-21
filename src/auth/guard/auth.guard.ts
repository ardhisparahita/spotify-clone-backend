import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthenticatedRequest,
  UserPayload,
} from '../interface/authenticated-request.interface';
import { jwtConstant } from '../constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException('missing token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<UserPayload>(token, {
        secret: jwtConstant.secret,
      });

      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or Expired token');
    }
  }

  private extractTokenFromHeader(
    req: AuthenticatedRequest,
  ): string | undefined {
    const authHeader = req.headers.authorization;

    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
