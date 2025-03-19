import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateOrderItemDto,
  UdateQuantityOrderItemDto,
} from '../dtos/order-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemsRepo: Repository<OrderItem>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async findById(id: number) {
    const item = await this.orderItemsRepo.findOne({
      where: { id },
      relations: { order: { customer: true } },
    });
    if (!item) {
      throw new NotFoundException(`Order Item #${id} not found`);
    }
    return item;
  }

  async create(data: CreateOrderItemDto) {
    const order = await this.orderRepo.findOne({
      where: { id: data.idOrder },
    });
    if (!order) {
      throw new NotFoundException(`Order #${data.idOrder} not found`);
    }
    const product = await this.productRepo.findOne({
      where: { id: data.idProduct },
    });
    if (!product) {
      throw new NotFoundException(`Product #${data.idProduct} not found`);
    }
    const item = this.orderItemsRepo.create();
    item.order = order;
    item.product = product;
    item.quantity = data.quantity;
    return await this.orderItemsRepo.save(item);
  }

  async update(id: number, data: UdateQuantityOrderItemDto) {
    const itemsOrder = await this.orderItemsRepo.findOne({
      where: { id },
      relations: { product: true },
      loadRelationIds: {
        relations: ['orders'],
        disableMixedMap: true,
      },
      order: { id: 'ASC' },
    });
    if (!itemsOrder) {
      throw new NotFoundException(`Order Item #${id} not found`);
    }

    this.orderItemsRepo.merge(itemsOrder, data);
    return await this.orderItemsRepo.save(itemsOrder);
  }

  async delete(id: number) {
    return await this.orderItemsRepo.delete(id);
  }
}
