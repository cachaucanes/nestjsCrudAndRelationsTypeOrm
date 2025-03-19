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
    const order = await this.orderRepo.findOne({
      where: { id },
      // relations: { orderItems: true },
      relations: { orderItems: { product: true }, customer: true },
      order: { orderItems: { id: 'ASC' } },
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }
  async findByIdCustomer(id: number) {
    const order = await this.orderRepo.findOne({
      where: { customer: { id } },
      // relations: { orderItems: true },
      relations: { orderItems: { product: true }, customer: true },
      order: { orderItems: { id: 'ASC' } },
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
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

  /**
   * Obtiene el total de la orden consultando la base de datos mediante la instancia de DataSource.
   * Adaptado para TypeORM 0.3.
   *
   * @returns El total de la orden como un número.
   */
  /* 
    SELECT o.id AS order_id, 
    SUM(p.price * oi.quantity) AS total
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.id = 1
    GROUP BY o.id;
  */
  async totalOrder(id: number): Promise<object> {
    const result: { total: string } | undefined = await this.orderRepo
      .createQueryBuilder('o')
      .select('SUM(p.price * oi.quantity)', 'total')
      .innerJoin('o.orderItems', 'oi')
      .innerJoin('oi.product', 'p')
      .where('o.id = :orderId', { orderId: id })
      .groupBy('o.id')
      .getRawOne();

    return {
      total: result ? Number(result.total) : 0,
    };
  }
}
