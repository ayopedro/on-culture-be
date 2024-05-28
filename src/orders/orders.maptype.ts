import { CrudMapType } from '@@/common/interfaces';
import { Prisma } from '@prisma/client';

export class OrderMaptype implements CrudMapType {
  aggregate: Prisma.OrderAggregateArgs;
  count: Prisma.OrderCountArgs;
  create: Prisma.OrderCreateArgs;
  delete: Prisma.OrderDeleteArgs;
  deleteMany: Prisma.OrderDeleteManyArgs;
  findFirst: Prisma.OrderFindFirstArgs;
  findMany: Prisma.OrderFindManyArgs;
  findUnique: Prisma.OrderFindUniqueArgs;
  update: Prisma.OrderUpdateArgs;
  updateMany: Prisma.OrderUpdateManyArgs;
  upsert: Prisma.OrderUpsertArgs;
}
