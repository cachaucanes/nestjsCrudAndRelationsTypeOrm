import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreateOrderDto {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  @IsPositive()
  readonly idCustomer: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
