import { FieldStatusEnum, Prisma } from '@prisma/client';

export class Book {
  id?: string;
  title: string;
  writer: string;
  coverImage: string;
  price: number;
  tags: string[];

  status?: FieldStatusEnum;
  metaData?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdById?: string;
  updatedById?: string;

  orderItems?: Prisma.OrderItemCreateNestedManyWithoutBooksInput;
}
