import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRoleEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { BaseQueryCriteriaDTO } from 'src/core/dtos';

export class UserQueryDTO extends BaseQueryCriteriaDTO {
  @ApiPropertyOptional({
    description: 'User role',
    type: UserRoleEnum,
    required: true,
  })
  @IsOptional()
  @IsString()
  role?: UserRoleEnum = undefined;

  @ApiPropertyOptional({
    description: 'Branch id',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  branchId?: string = undefined;

  @ApiPropertyOptional({
    description: 'User email',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  email?: string = undefined;

  @ApiPropertyOptional({
    description: 'User phone',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  phone?: string = undefined;

  @ApiPropertyOptional({
    description: 'Is EmailVerified',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isEmailVerified?: boolean = undefined;

  @ApiPropertyOptional({
    description: 'Is PhoneVerified',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isPhoneVerified?: boolean = undefined;
}
