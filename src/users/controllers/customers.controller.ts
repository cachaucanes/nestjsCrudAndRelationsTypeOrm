import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { CustomersService } from '../services/customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the customer (must be a number)',
    required: true,
    type: Number, // Swagger lo interpreta correctamente
    examples: {
      valid: {
        value: '1',
        summary: 'A valid example',
      },
      invalid: {
        value: 'abc',
        summary: 'An invalid example',
      },
      invalidTwo: {
        value: "'1'",
        summary: 'Secund invalid example',
      },
    },
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Post()
  @ApiBody({
    description: 'Data needed to create a new customer',
    required: true,
    type: CreateCustomerDto,
    examples: {
      valid: {
        value: {
          name: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
        },
        summary: 'A valid example',
      },
      invalid: {
        value: {
          name: 'JO',
          lastName: '23432',
          phone: 'abc67890',
        },
        summary: 'An invalid example',
      },
    },
  }) // Swagger lo interpreta correctamente
  create(@Body() payload: CreateCustomerDto) {
    return this.customersService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }
}
