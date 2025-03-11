import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { OrderItem } from './order-item.entity';
import { Exclude, Expose } from 'class-transformer';
// import AppDataSource from '../../database/data-source';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({
    name: 'customer_id',
  })
  customer: Customer;

  // Excluye la propiedad 'orderItems' de la serialización al transformar la entidad en JSON.
  @Exclude()
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  /**
   * @Expose() Permite incluir esta propiedad en la transformación a JSON.
   *
   * Devuelve una lista de los productos en la orden, con la cantidad y el ID del ítem.
   * Esto evita exponer directamente la relación `orderItems`, permitiendo un formato más limpio.
   *
   * @returns Un array de objetos con los detalles del producto y su cantidad.
   */
  @Expose()
  get items() {
    if (this.orderItems) {
      return this.orderItems
        .filter((item) => !!item) // Filtra elementos nulos o undefined
        .map((item) => ({
          ...item.product, // Retorna los datos del producto
          quantity: item.quantity, // Agrega la cantidad del producto en el pedido
          itemId: item.id, // Incluye el ID del item en la orden
        }));
    }
    return [];
  }

  /**
   * @Expose() Permite incluir esta propiedad en la transformación a JSON.
   *
   * Calcula el total de la orden sumando el precio de cada producto multiplicado por su cantidad.
   *
   * @returns El total de la orden como un número.
   */
  @Expose()
  get total() {
    if (this.items) {
      return this.items
        .filter((item) => !!item)
        .reduce((ac, prev) => {
          const totalItem = prev.price * prev.quantity;
          return ac + totalItem;
        }, 0);
    }
    return 0;
  }
}
