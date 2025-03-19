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
export class CustomerOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ user: PayloadToken; params: { id: string } }>();
    const userToken = request.user;

    if (userToken.role === 'admin') {
      return true;
    }

    if (userToken.role === 'customer') {
      const user = await this.usersService.findOne(userToken.sub);
      const customerId = parseInt(request.params?.id || '0', 10);
      if (customerId === user.customer.id) {
        return true;
      }
    }

    throw new ForbiddenException(
      'You do not have permission to perform actions on this profile',
    );
  }
}
