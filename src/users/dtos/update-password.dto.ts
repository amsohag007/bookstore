import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdatePasswordDTO {
  @ApiProperty({
    description: "User old password ",
    type: String,
    required: true
  })
  @IsOptional()
  @IsString()
  oldPassword?: string;

  @ApiProperty({
    description: "User New password ",
    type: String,
    required: true
  })
  @IsOptional()
  @IsString()
  password?: string;

  constructor(partial: Partial<UpdatePasswordDTO>) {
    Object.assign(this, partial);
  }
}
