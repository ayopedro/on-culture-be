import { CrudMapType } from '@@/common/interfaces';
import { Prisma } from '@prisma/client';

export class ProductMaptype implements CrudMapType {
  aggregate: Prisma.ProductAggregateArgs;
  count: Prisma.ProductCountArgs;
  create: Prisma.ProductCreateArgs;
  delete: Prisma.ProductDeleteArgs;
  deleteMany: Prisma.ProductDeleteManyArgs;
  findFirst: Prisma.ProductFindFirstArgs;
  findMany: Prisma.ProductFindManyArgs;
  findUnique: Prisma.ProductFindUniqueArgs;
  update: Prisma.ProductUpdateArgs;
  updateMany: Prisma.ProductUpdateManyArgs;
  upsert: Prisma.ProductUpsertArgs;
}
