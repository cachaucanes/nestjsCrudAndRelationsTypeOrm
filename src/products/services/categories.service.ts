import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private cateroryRepo: Repository<Category>,
  ) {}

  async findAll() {
    return await this.cateroryRepo.find({
      relations: { products: true },
    });
  }

  async findOne(id: number) {
    const category = await this.cateroryRepo.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async create(data: CreateCategoryDto) {
    const newCategory = this.cateroryRepo.create(data);
    return await this.cateroryRepo.save(newCategory);
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const category = await this.findOne(id);
    this.cateroryRepo.merge(category, changes);
    return await this.cateroryRepo.save(category);
  }

  async remove(id: number) {
    const existCategory = await this.findOne(id);
    if (!existCategory) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return await this.cateroryRepo.delete(id);
  }
}
