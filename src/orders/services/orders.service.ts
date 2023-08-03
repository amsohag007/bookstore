import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/services';
import {
  OrderQueryDTO,
  CreateOrderDTO,
  UpdateOrderDTO,
  UpdateOrderStausDTO,
} from '../dtos';
import { ApiResponseDTO } from 'src/core/dtos';
import { PrismaErrorHandler } from 'src/core/handlers/prisma-error.handler';
import { NotDataFoundResponse } from 'src/core/constants';
import { Order } from '../entity';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  /// create new noteorder by super admin--------
  async create(
    userId: string,
    createOrderDTO: CreateOrderDTO,
  ): Promise<ApiResponseDTO<Order>> {
    try {
      const books = await this.prismaService.book.findMany({
        where: {
          id: {
            in: createOrderDTO.books,
          },
        },
      });

      // console.log('books', books);

      if (books.length !== createOrderDTO.books.length) {
        throw new NotFoundException('One or more books not found.');
      }

      const totalPrice = books.reduce(
        (accumulator, book) => accumulator + book.price,
        0,
      );

      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (totalPrice > user.point) {
        throw new BadRequestException(
          'You donot have enough point to place this order!',
        );
      }

      const updateUserPoint = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          point: user.point - totalPrice,
        },
      });

      const order = await this.prismaService.order.create({
        data: {
          userId,
          orderItems: {
            create: createOrderDTO.books.map((bookId) => ({ bookId: bookId })),
          },
        },
        include: {
          orderItems: {
            include: {
              books: true,
            },
          },
        },
      });

      return {
        status: 'success',
        data: order,
        message: 'Orders has been successfully created.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  // find all-------- can be filtered by criteria
  async findByCriteria(query: OrderQueryDTO): Promise<ApiResponseDTO<Order[]>> {
    const filters = {
      status: query.status,
      userId: query.userId,
    };

    try {
      const totalCount = await this.prismaService.order.count({
        where: filters,
      });
      const totalPages = Math.ceil(totalCount / query.pageSize);

      if (totalCount === 0) {
        return NotDataFoundResponse;
      }

      const orders = await this.prismaService.order.findMany({
        orderBy: {
          createdAt: query.orderBy,
        },
        take: query.pageSize,
        skip: (query.pageIndex - 1) * query.pageSize,
        where: filters,
        include: {
          orderItems: {
            include: {
              books: true,
            },
          },
        },
      });

      return {
        status: 'success',
        message: 'Orders retrieve successful.',
        data: orders,
        currentPage: query.pageIndex,
        pageSize: query.pageSize,
        totalPages: totalPages,
        totalCount: totalCount,
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  //find one ------
  async findOne(id: string): Promise<ApiResponseDTO<Order>> {
    try {
      const order = await this.prismaService.order.findUnique({
        where: {
          id: id,
        },
        include: {
          orderItems: {
            include: {
              books: true,
            },
          },
        },
      });

      if (order === null) {
        return NotDataFoundResponse;
      }
      return {
        status: 'success',
        data: order,
        message: 'Orders retrieve successful.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  //update ----------
  async update(
    id: string,
    userId: string,
    updateOrderDTO: UpdateOrderDTO,
  ): Promise<ApiResponseDTO<Order>> {
    try {
      const updatedOrderData = await this.prismaService.order.update({
        where: {
          id: id,
        },
        data: {
          ...updateOrderDTO,
          updatedById: userId,
        },
      });
      return {
        status: 'success',
        data: updatedOrderData,
        message: ' Orders info has been updated.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  //update ----------
  async updateStatus(
    id: string,
    userId: string,
    updateOrderStausDTO: UpdateOrderStausDTO,
  ): Promise<ApiResponseDTO<Order>> {
    try {
      const updatedOrderData = await this.prismaService.order.update({
        where: {
          id: id,
        },
        data: {
          ...updateOrderStausDTO,
          updatedById: userId,
        },
      });
      return {
        status: 'success',
        data: updatedOrderData,
        message: ' Orders info has been updated.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  //remove
  async remove(id: string) {
    try {
      return await this.prismaService.order.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }
}
