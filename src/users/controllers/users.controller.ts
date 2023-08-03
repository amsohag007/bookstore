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
  Version,
  UseGuards,
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
import { UsersService } from 'src/users/services';
import { ApiExceptionResponseDTO, ApiResponseDTO } from 'src/core/dtos';
import { GetCurrentUserId, Roles } from 'src/authentications/common/decorators';
import { RolesGuard } from 'src/authentications/common/guards';
import {
  CreateUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
  UpdateUserStatusDTO,
  UserDTO,
  UserQueryDTO,
} from '../dtos';

@Controller('users')
@ApiBearerAuth('JWT')
@ApiTags('User API')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('create')
  @Roles('ADMIN', 'MANAGER', 'USER') // added user for testing purpose
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user.(ADMIN ONLY)' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: UserDTO,
    description: 'Record has been created successfully.',
  })
  @ApiBody({
    type: CreateUserDTO,
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
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<ApiResponseDTO<UserDTO>> {
    return await this.usersService.create(userId, createUserDTO);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'USER') // added user for testing purpose
  @UseGuards(RolesGuard)
  @Version('1')
  @ApiOperation({ summary: 'Get user by criteria.' })
  @ApiOkResponse({
    type: UserDTO,
    description: 'Records have been retrieved successfully.',
    isArray: true,
  })
  @ApiNotFoundResponse({
    type: ApiExceptionResponseDTO,
    description: 'No data found.',
  })
  @ApiProduces('application/json')
  async findByCriteria(
    @Query() query: UserQueryDTO,
  ): Promise<ApiResponseDTO<UserDTO>> {
    return await this.usersService.findByCriteria(query);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'USER') // added user for testing purpose
  @UseGuards(RolesGuard)
  @Version('1')
  @ApiOperation({ summary: 'Get user by id.' })
  @ApiParam({
    name: 'id',
    description: 'Should be an id of a user that exists in the database.',
    type: String,
    format: 'uuid',
    required: true,
  })
  @ApiOkResponse({
    type: UserDTO,
    description: 'Record has been retrieved successfully.',
    isArray: false,
  })
  @ApiNotFoundResponse({
    type: ApiExceptionResponseDTO,
    description: 'No data found.',
  })
  @ApiProduces('application/json')
  async findOne(@Param('id') id: string): Promise<ApiResponseDTO<UserDTO>> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER', 'USER')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user details.' })
  @ApiOkResponse({
    description: 'Record has been updated successfully.',
    type: UserDTO,
  })
  @ApiBody({
    type: UpdateUserDTO,
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
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<ApiResponseDTO<UserDTO>> {
    return await this.usersService.update(id, userId, updateUserDTO);
  }

  @Patch(':id/password')
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user password.' })
  @ApiOkResponse({
    description: 'Record has been updated successfully.',
    type: UserDTO,
  })
  @ApiBody({
    type: UpdatePasswordDTO,
    description: 'Data to update record.',
    required: true,
  })
  @ApiNotFoundResponse({
    type: ApiExceptionResponseDTO,
    description: 'No data found.',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  async updatePassword(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
    @Body() updatePasswordDTO: UpdatePasswordDTO,
  ): Promise<ApiResponseDTO<UserDTO>> {
    return await this.usersService.updatePassword(
      id,
      userId,
      updatePasswordDTO,
    );
  }

  @Patch(':id/status')
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user status.' })
  @ApiOkResponse({
    description: 'Record has been updated successfully.',
    type: UserDTO,
  })
  @ApiBody({
    type: UpdateUserStatusDTO,
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
    @Body() updateStatusDTO: UpdateUserStatusDTO,
  ): Promise<ApiResponseDTO<UserDTO>> {
    return await this.usersService.updateStatus(id, userId, updateStatusDTO);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user.' })
  @ApiParam({
    name: 'id',
    description: 'Should be an id of user that exists in the database.',
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
    return await this.usersService.remove(id);
  }
}
