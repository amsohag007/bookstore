import { FieldStatusEnum, OrderStatusEnum, Prisma } from '@prisma/client';

export class Order {
  id: string;
  orderStatus: OrderStatusEnum;
  userId: string;

  status?: FieldStatusEnum;
  metaData?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdById?: string;
  updatedById?: string;
}
