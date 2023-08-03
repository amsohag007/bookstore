import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsNumber, IsString } from 'class-validator';
import { BaseDTO } from 'src/core/dtos';

export class BookDTO extends BaseDTO {
  @ApiProperty({
    description: 'Book title',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Book writter',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  writer: string;

  @ApiProperty({
    description: 'Book coverImage',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  coverImage: string;

  @ApiProperty({
    description: 'Book price',
    type: Number,
    required: true,
  })
  @IsDefined()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Book tags',
    type: String,
    isArray: true,
    required: true,
  })
  @IsDefined()
  @IsArray()
  tags: string[];

  constructor(partial: Partial<BookDTO>) {
    super();
    Object.assign(this, partial);
  }
}
