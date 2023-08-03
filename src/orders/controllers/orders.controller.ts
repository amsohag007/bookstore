import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from '../services';
import {
  GetCurrentUserId,
  Public,
  Roles,
} from 'src/authentications/common/decorators';
import { RolesGuard } from 'src/authentications/common/guards';
import {
  OrderDTO,
  OrderQueryDTO,
  CreateOrderDTO,
  UpdateOrderDTO,
  UpdateOrderStausDTO,
} from '../dtos';
import { ApiExceptionResponseDTO, ApiResponseDTO } from 'src/core/dtos';

@Controller('orders')
@ApiBearerAuth('JWT')
@ApiTags('Orders API')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @Roles('USER')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new order.' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: OrderDTO,
    description: 'Record has been created successfully.',
  })
  @ApiBody({
    type: CreateOrderDTO,
    description: 'Data to create new record..',
    required: true,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  async create(
    @GetCurrentUserId() userId: string,
    @Body() createOrderDTO: CreateOrderDTO,
  ): Promise<ApiResponseDTO<OrderDTO>> {
    return await this.orderService.create(userId, createOrderDTO);
  }

  @Get()
  @Roles('USER', 'MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Version('1')
  @ApiOperation({ summary: 'Get order by criteria.' })
  @ApiOkResponse({
    type: OrderDTO,
    description: 'Records have been retrieved successfully.',
    isArray: true,
  })
  @ApiNotFoundResponse({
    type: ApiExceptionResponseDTO,
    description: 'No data found.',
  })
  @ApiProduces('application/json')
  async findByCriteria(
    @Query() query: OrderQueryDTO,
  ): Promise<ApiResponseDTO<OrderDTO>> {
    return await this.orderService.findByCriteria(query);
  }

  @Get(':id')
  @Roles('USER', 'MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Version('1')
  @ApiOperation({ summary: 'Get order by id.' })
  @ApiParam({
    name: 'id',
    description: 'Should be an id of a order that exists in the database.',
    type: String,
    format: 'uuid',
    required: true,
  })
  @ApiOkResponse({
    type: OrderDTO,
    description: 'Record has been retrieved successfully.',
    isArray: false,
  })
  @ApiNotFoundResponse({
    type: ApiExceptionResponseDTO,
    description: 'No data found.',
  })
  @ApiProduces('application/json')
  async findOne(@Param('id') id: string): Promise<ApiResponseDTO<OrderDTO>> {
    return await this.orderService.findOne(id);
  }

  @Patch(':id')
  @Roles('USER', 'MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update order details' })
  @ApiOkResponse({
    description: 'Record has been updated successfully.',
    type: OrderDTO,
  })
  @ApiBody({
    type: UpdateOrderDTO,
    description: 'Data to update record.',
    required: true,
  })
  @ApiNotFoundResponse({
    type: ApiExceptionResponseDTO,
    description: 'No data found.',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  async update(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateOrderDTO: UpdateOrderDTO,
  ): Promise<ApiResponseDTO<OrderDTO>> {
    return await this.orderService.update(id, userId, updateOrderDTO);
  }

  @Patch(':id/status')
  @Roles('USER', 'MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update order status.(to cancel order or deliver)' })
  @ApiOkResponse({
    description: 'Record has been updated successfully.',
    type: OrderDTO,
  })
  @ApiBody({
    type: UpdateOrderStausDTO,
    description: 'Data to update record.',
    required: true,
  })
  @ApiNotFoundResponse({
    type: ApiExceptionResponseDTO,
    description: 'No data found.',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  async updateStatus(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateOrderStatusDTO: UpdateOrderStausDTO,
  ): Promise<ApiResponseDTO<OrderDTO>> {
    return await this.orderService.updateStatus(
      id,
      userId,
      updateOrderStatusDTO,
    );
  }

  @Delete(':id')
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete order.' })
  @ApiParam({
    name: 'id',
    description: 'Should be an id of order that exists in the database.',
    type: String,
    format: 'uuid',
    required: true,
  })
  @ApiNoContentResponse({
    description: 'Record has been deleted successfully.',
  })
  @ApiNotFoundResponse({
    type: ApiExceptionResponseDTO,
    description: 'No data found.',
  })
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(id);
  }
}
