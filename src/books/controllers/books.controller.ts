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
import { BookService } from '../services';
import {
  GetCurrentUserId,
  Public,
  Roles,
} from 'src/authentications/common/decorators';
import { RolesGuard } from 'src/authentications/common/guards';
import { BookDTO, BookQueryDTO, CreateBookDTO, UpdateBookDTO } from '../dtos';
import { ApiExceptionResponseDTO, ApiResponseDTO } from 'src/core/dtos';

@Controller('books')
@ApiBearerAuth('JWT')
@ApiTags('Books API')
export class BookController {
  constructor(private bookService: BookService) {}

  @Post()
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new book.' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: BookDTO,
    description: 'Record has been created successfully.',
  })
  @ApiBody({
    type: CreateBookDTO,
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
    @Body() createBookDTO: CreateBookDTO,
  ): Promise<ApiResponseDTO<BookDTO>> {
    return await this.bookService.create(userId, createBookDTO);
  }

  @Get()
  @Public()
  @Version('1')
  @ApiOperation({ summary: 'Get book by criteria.' })
  @ApiOkResponse({
    type: BookDTO,
    description: 'Records have been retrieved successfully.',
    isArray: true,
  })
  @ApiNotFoundResponse({
    type: ApiExceptionResponseDTO,
    description: 'No data found.',
  })
  @ApiProduces('application/json')
  async findByCriteria(
    @Query() query: BookQueryDTO,
  ): Promise<ApiResponseDTO<BookDTO>> {
    return await this.bookService.findByCriteria(query);
  }

  @Get(':id')
  @Public()
  @Version('1')
  @ApiOperation({ summary: 'Get book by id.' })
  @ApiParam({
    name: 'id',
    description: 'Should be an id of a book that exists in the database.',
    type: String,
    format: 'uuid',
    required: true,
  })
  @ApiOkResponse({
    type: BookDTO,
    description: 'Record has been retrieved successfully.',
    isArray: false,
  })
  @ApiNotFoundResponse({
    type: ApiExceptionResponseDTO,
    description: 'No data found.',
  })
  @ApiProduces('application/json')
  async findOne(@Param('id') id: string): Promise<ApiResponseDTO<BookDTO>> {
    return await this.bookService.findOne(id);
  }

  @Patch(':id')
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update book details.' })
  @ApiOkResponse({
    description: 'Record has been updated successfully.',
    type: BookDTO,
  })
  @ApiBody({
    type: UpdateBookDTO,
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
    @Body() updateBookDTO: UpdateBookDTO,
  ): Promise<ApiResponseDTO<BookDTO>> {
    return await this.bookService.update(id, userId, updateBookDTO);
  }

  @Delete(':id')
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete book.' })
  @ApiParam({
    name: 'id',
    description: 'Should be an id of book that exists in the database.',
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
    return await this.bookService.remove(id);
  }
}
