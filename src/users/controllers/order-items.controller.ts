import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateOrderItemDto,
  UdateQuantityOrderItemDto,
} from '../dtos/order-item.dto';
import { OrderItemsService } from '../services/order-items.service';

@Controller('order-items')
export class OrderItemsController {
  constructor(private orderItems: OrderItemsService) {}

  @Post()
  create(@Body() payload: CreateOrderItemDto) {
    return this.orderItems.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UdateQuantityOrderItemDto,
  ) {
    return this.orderItems.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.orderItems.delete(id);
  }
}
