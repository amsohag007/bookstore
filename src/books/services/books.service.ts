import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services';
import { BookQueryDTO, CreateBookDTO, UpdateBookDTO } from '../dtos';
import { ApiResponseDTO } from 'src/core/dtos';
import { PrismaErrorHandler } from 'src/core/handlers/prisma-error.handler';
import { NotDataFoundResponse } from 'src/core/constants';
import { Book } from '../entity';

@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}

  /// create new notebook by super admin--------
  async create(
    userId: string,
    createBookDTO: CreateBookDTO,
  ): Promise<ApiResponseDTO<Book>> {
    try {
      const createdBook = await this.prismaService.book.create({
        data: {
          ...createBookDTO,
          createdById: userId,
        },
      });

      return {
        status: 'success',
        data: createdBook,
        message: 'Books has been successfully created.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  // find all-------- can be filtered by criteria
  async findByCriteria(query: BookQueryDTO): Promise<ApiResponseDTO<Book[]>> {
    const filters = {
      status: query.status,
      title: query.title,
      writer: query.writer,
    };

    try {
      const totalCount = await this.prismaService.book.count({
        where: filters,
      });
      const totalPages = Math.ceil(totalCount / query.pageSize);

      if (totalCount === 0) {
        return NotDataFoundResponse;
      }

      const books = await this.prismaService.book.findMany({
        orderBy: {
          createdAt: query.orderBy,
        },
        take: query.pageSize,
        skip: (query.pageIndex - 1) * query.pageSize,
        where: filters,
      });

      return {
        status: 'success',
        message: 'Books retrieve successful.',
        data: books,
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
  async findOne(id: string): Promise<ApiResponseDTO<Book>> {
    try {
      const book = await this.prismaService.book.findUnique({
        where: {
          id: id,
        },
      });

      if (book === null) {
        return NotDataFoundResponse;
      }
      return {
        status: 'success',
        data: book,
        message: 'Books retrieve successful.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  //update ----------
  async update(
    id: string,
    userId: string,
    updateBookDTO: UpdateBookDTO,
  ): Promise<ApiResponseDTO<Book>> {
    try {
      const updatedBookData = await this.prismaService.book.update({
        where: {
          id: id,
        },
        data: {
          ...updateBookDTO,
          updatedById: userId,
        },
      });
      return {
        status: 'success',
        data: updatedBookData,
        message: ' Books info has been updated.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  //remove
  async remove(id: string) {
    try {
      return await this.prismaService.book.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }
}
