import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateRedisCacheDTO {
  @ApiProperty({
    type: String,
    description: 'Key of the cache data.',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  key!: string;

  @ApiProperty({
    description: 'Data to be stored in the cache.',
    type: Object,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsObject()
  data!: any;

  @ApiProperty({
    type: Number,
    description:
      'Duration of how long the data will be cached. e.g. provide in seconds.',
    required: false,
  })
  duration?: number;
}
