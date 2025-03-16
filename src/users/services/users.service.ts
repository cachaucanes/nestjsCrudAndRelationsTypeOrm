import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

import { ProductsService } from './../../products/services/products.service';
import { Client } from 'pg';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from './customers.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    @Inject('PG') private pg: Client,
    @InjectRepository(User) private userRepo: Repository<User>,
    private customersService: CustomersService,
  ) {}

  async findAll() {
    return await this.userRepo.find({
      relations: ['customer'],
    });
    /*  const result = await this.pg.query<User>('SELECT * FROM tasks');
    return result.rows; */

    /* return new Promise((resolve, reject) => {
      this.pg.query('SELECT * from tasks', (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.rows);
        }
      });
    }); */
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }
  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    /* if (!user) {
      throw new NotFoundException(`User #${email} not found`);
    } */
    return user;
  }
  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);

    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;

    if (data.idCustomer) {
      newUser.customer = await this.customersService.findOne(data.idCustomer);
    }
    return await this.userRepo.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    this.userRepo.merge(user, changes);
    return await this.userRepo.save(user);
  }

  async remove(id: number) {
    return await this.userRepo.delete(id);
  }
  /* 
  getOrderByUser(id: number): Order {
    const user = this.findOne(id);
    return {
      date: new Date(),
      user,
      products: this.productsService.findAll(),
    };
  } */
}
