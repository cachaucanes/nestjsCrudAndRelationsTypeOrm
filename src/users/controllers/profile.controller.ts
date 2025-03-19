import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/roles.models';
import { PayloadToken } from 'src/auth/models/token.model';
import { OrdersService } from '../services/orders.service';
import { UsersService } from '../services/users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('profile')
export class ProfileController {
  constructor(
    private orderService: OrdersService,
    private usersService: UsersService,
  ) {}

  @Roles(Role.CUSTOMER)
  @Get('my-orders')
  async getOrders(@Req() req: Request) {
    const userToken = req.user as PayloadToken;
    const user = await this.usersService.findOne(userToken.sub);
    return this.orderService.findByIdCustomer(user.customer.id);
  }
}
