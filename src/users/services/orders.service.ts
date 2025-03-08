import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  async findAll() {
    return await this.orderRepo.find();
  }

  async findOne(id: number) {
    const product = await this.orderRepo.findOne({
      where: { id },
      // relations: { orderItems: true },
      relations: { orderItems: { product: true } },
      order: { orderItems: { id: 'ASC' } },
    });
    if (!product) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return product;
  }

  async create(data: CreateOrderDto) {
    const newOrder = this.orderRepo.create();
    if (data.idCustomer) {
      const customer = await this.customerRepo.findOne({
        where: { id: data.idCustomer },
      });
      if (!customer) {
        throw new NotFoundException(`Order #${data.idCustomer} not found`);
      }
      newOrder.customer = customer;
    }
    return await this.orderRepo.save(newOrder);
  }

  async update(id: number, changes: UpdateOrderDto) {
    const order = await this.findOne(id);
    if (changes.idCustomer) {
      const customer = await this.customerRepo.findOne({
        where: { id: changes.idCustomer },
      });
      if (!customer) {
        throw new NotFoundException(`Order #${id} not found`);
      }
      order.customer = customer;
    }
    return await this.orderRepo.save(order);
  }

  async remove(id: number) {
    return await this.orderRepo.delete(id);
  }
}
