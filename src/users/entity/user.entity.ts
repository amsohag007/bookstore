import { FieldStatusEnum, Prisma, UserRoleEnum } from '@prisma/client';

export class User {
  id: string;
  firstName?: string;
  lastName?: string;
  userName: string;
  email: string;
  phone?: string;
  password?: string;
  address?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  point: number;
  role: UserRoleEnum;

  status?: FieldStatusEnum;
  metaData?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdById?: string;
  updatedById?: string;
}
