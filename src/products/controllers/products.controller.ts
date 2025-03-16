import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  // ParseIntPipe,
} from '@nestjs/common';

import { ProductsService } from './../services/products.service';
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../dtos/product.dto';
import { ParseIntPipe } from 'src/common/parse-int.pipe';
// import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { Public } from 'src/auth/decorators/public.decorator';
// import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.models';
import { RolesGuard } from 'src/auth/guards/roles.guard';

// @UseGuards(AuthGuard('jwt'), ApiKeyGuard)
// @UseGuards(ApiKeyGuard)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  getProducts(@Query() params: FilterProductsDto) {
    /* getProducts(
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
    @Query('brand') brand: string,
  ) { */
    // return {
    //   message: `products limit=> ${limit} offset=> ${offset} brand=> ${brand}`,
    // };

    return this.productsService.findAll(params);
  }

  @Get('filter')
  getProductFilter() {
    return `yo soy un filter`;
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', ParseIntPipe) id: number) {
    // response.status(200).send({
    //   message: `product ${id}`,
    // });
    return this.productsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() payload: CreateProductDto) {
    // return {
    //   message: 'accion de crear',
    //   payload,
    // };
    return this.productsService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProductDto,
  ) {
    return this.productsService.update(id, payload);
  }

  @Put(':id/category/:idCategory')
  addCategoryToProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('idCategory', ParseIntPipe) idCategory: number,
  ) {
    return this.productsService.addCategoryToProduct(id, idCategory);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Delete(':id/category/:idCategory')
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('idCategory', ParseIntPipe) idCategory: number,
  ) {
    return this.productsService.removeCategoryByProduct(id, idCategory);
  }
}
/* 

	insomnia.variables.set("token", 'hello world');
	insomnia.globals.set("token", "variable_value1");
	insomnia.collectionVariables.set("token", "variable_value22");
*/
