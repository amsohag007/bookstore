import { Injectable } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/core/services';
import { BookDTO, BookQueryDTO, CreateBookDTO, UpdateBookDTO } from '../dtos';
import { ApiResponseDTO } from 'src/core/dtos';
import { PrismaErrorHandler } from 'src/core/handlers/prisma-error.handler';
import { NotDataFoundResponse } from 'src/core/constants';

@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}

  /// create new notebook by super admin--------
  async create(
    userId: string,
    createBookDTO: CreateBookDTO,
  ): Promise<ApiResponseDTO<BookDTO>> {
    try {
      const createdBook = await this.prismaService.book.create({
        data: {
          ...createBookDTO,
          createdById: userId,
        },
      });

      return {
        status: 'success',
        data: new BookDTO(createdBook),
        message: 'Books has been successfully created.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  // find all-------- can be filtered by criteria
  async findByCriteria(query: BookQueryDTO): Promise<ApiResponseDTO<BookDTO>> {
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

      const book = JSON.stringify(
        instanceToPlain(
          await this.prismaService.book.findMany({
            orderBy: {
              createdAt: query.orderBy,
            },
            take: query.pageSize,
            skip: (query.pageIndex - 1) * query.pageSize,
            where: filters,
          }),
        ),
      );

      return {
        status: 'success',
        message: 'Books retrieve successful.',
        data: plainToInstance(BookDTO, JSON.parse(book)),
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
  async findOne(id: string): Promise<ApiResponseDTO<BookDTO>> {
    try {
      const notebook = JSON.stringify(
        instanceToPlain(
          await this.prismaService.book.findUnique({
            where: {
              id: id,
            },
          }),
        ),
      );

      if (JSON.parse(notebook) === null) {
        return NotDataFoundResponse;
      }
      return {
        status: 'success',
        data: plainToInstance(BookDTO, JSON.parse(notebook)),
        message: 'Books retrieve successful.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  //update ----------
  async update(
    id: string,
    userId,
    updateBookDTO: UpdateBookDTO,
  ): Promise<ApiResponseDTO<BookDTO>> {
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
        data: new BookDTO(updatedBookData),
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
