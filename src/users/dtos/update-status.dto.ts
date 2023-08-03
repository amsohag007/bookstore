import { ApiProperty } from "@nestjs/swagger";
import { FieldStatusEnum } from "@prisma/client";
import { IsDefined, IsString } from "class-validator";

export class UpdateUserStatusDTO {
  @ApiProperty({
    description: "User Staus ",
    enum: FieldStatusEnum,
    required: true
  })
  @IsDefined()
  @IsString()
  status: FieldStatusEnum;

  constructor(partial: Partial<UpdateUserStatusDTO>) {
    Object.assign(this, partial);
  }
}
