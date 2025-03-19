import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CreateOrderItemDto,
  UdateQuantityOrderItemDto,
} from '../dtos/order-item.dto';
import { OrderItemsService } from '../services/order-items.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.models';
import {
  CustomerCreateOrderItemsOwnerGuard,
  CustomerUpdateOrderItemsOwnerGuard,
} from 'src/auth/guards/customer_order_items_owner.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order-items')
export class OrderItemsController {
  constructor(private orderItems: OrderItemsService) {}

  @Roles(Role.ADMIN, Role.CUSTOMER)
  @UseGuards(CustomerCreateOrderItemsOwnerGuard)
  @Post()
  create(@Body() payload: CreateOrderItemDto) {
    return this.orderItems.create(payload);
  }

  @Roles(Role.ADMIN, Role.CUSTOMER)
  @UseGuards(CustomerUpdateOrderItemsOwnerGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UdateQuantityOrderItemDto,
  ) {
    return this.orderItems.update(id, payload);
  }

  @Roles(Role.ADMIN, Role.CUSTOMER)
  @UseGuards(CustomerUpdateOrderItemsOwnerGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.orderItems.delete(id);
  }
}
