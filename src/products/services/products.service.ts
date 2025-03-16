import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../dtos/product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, In, Repository } from 'typeorm';
import { BrandsService } from './brands.service';
import { Category } from '../entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    private brandsService: BrandsService,
  ) {}

  async findAll(params?: FilterProductsDto) {
    const where: FindOptionsWhere<Product> = {};
    let pagination = {};

    if (params) {
      const { limit, offset, minPrice, maxPrice } = params;
      if (minPrice && maxPrice) {
        where.price = Between(minPrice, maxPrice);
      }
      if (limit) {
        pagination = {
          take: limit,
          skip: offset,
        };
      }
    }

    return await this.productRepo.find({
      relations: { brand: true },
      where,
      ...pagination,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: { brand: true, categories: true },
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    // const newProduct = new Product();
    // newProduct.name = data.name;
    // newProduct.description = data.description;
    // newProduct.price = data.price;
    // newProduct.stock = data.stock;
    // newProduct.image = data.image;
    const newProduct = this.productRepo.create(data);
    if (data.idBrand) {
      const brand = await this.brandsService.findOne(data.idBrand);
      newProduct.brand = brand;
    }
    if (data.idCategories) {
      const categories = await this.categoryRepo.findBy({
        id: In(data.idCategories),
      });
      newProduct.categories = categories;
    }
    return await this.productRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.findOne(id);
    if (changes.idBrand) {
      const brand = await this.brandsService.findOne(changes.idBrand);
      product.brand = brand;
    }
    if (changes.idCategories) {
      const categories = await this.categoryRepo.findBy({
        id: In(changes.idCategories),
      });
      product.categories = categories;
    }
    this.productRepo.merge(product, changes);
    //al hacer el merge el mismo guarda la referencia en el producto referenciado (por lo que no tuvimos que guardarlo en una variable)
    return this.productRepo.save(product);
  }

  async removeCategoryByProduct(idProduct: number, idCategory: number) {
    const product = await this.productRepo.findOne({
      where: { id: idProduct },
      relations: { categories: true },
    });

    if (!product) {
      throw new NotFoundException(`Product #${idProduct} not found`);
    }
    product.categories = product.categories.filter(
      (item) => item.id !== idCategory,
    );
    return this.productRepo.save(product);
  }

  async addCategoryToProduct(idProduct: number, idCategory: number) {
    const product = await this.productRepo.findOne({
      where: { id: idProduct },
      relations: ['categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${idProduct} not found`);
    }
    const category = await this.categoryRepo.findOneBy({ id: idCategory });
    if (category) {
      product.categories.push(category);
    }
    return this.productRepo.save(product);
  }

  async remove(id: number) {
    return await this.productRepo.delete(id);
  }
}
