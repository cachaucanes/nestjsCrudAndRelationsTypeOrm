import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC } from '../decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['secund_validation'] as
      | string
      | undefined;
    console.log(typeof authHeader, typeof this.configService.get('API_KEY'));

    const isAuth = authHeader === this.configService.get('API_KEY');
    if (!isAuth) {
      throw new UnauthorizedException('Not authorized secund_validation');
    }
    return true;
  }
}
