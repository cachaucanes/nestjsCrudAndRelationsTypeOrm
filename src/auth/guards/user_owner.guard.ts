import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PayloadToken } from '../models/token.model';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ user: PayloadToken; params: { id: string } }>();
    const userToken = request.user;

    if (userToken.role === 'admin') {
      return true;
    }

    if (userToken.role === 'customer') {
      const userIdSession = userToken.sub;
      const userIdParam = parseInt(request.params?.id || '0', 10);
      if (userIdSession === userIdParam) {
        return true;
      }
    }

    throw new ForbiddenException(
      'You do not have permission to perform actions on this profile',
    );
  }
}
