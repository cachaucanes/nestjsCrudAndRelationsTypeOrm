import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PayloadToken } from '../models/token.model';
import { UsersService } from 'src/users/services/users.service';
import { OrdersService } from 'src/users/services/orders.service';

@Injectable()
export class CustomerOrderOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
    private ordersService: OrdersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ user: PayloadToken; params: { id: string } }>();
    const user = request.user;

    if (user.role === 'admin') {
      return true;
    }

    if (user.role === 'customer') {
      const idOrder = parseInt(request.params?.id || '0', 10);
      const userSign = await this.usersService.findOne(user.sub);
      const order = await this.ordersService.findOne(idOrder);

      if (userSign.customer.id === order.customer.id) {
        return true;
      }
    }

    throw new ForbiddenException(
      'You do not have permission to perform actions on this profile',
    );
  }
}
