import { CrudMapType } from '@@/common/interfaces';
import { Prisma } from '@prisma/client';

export class CustomerMaptype implements CrudMapType {
  aggregate: Prisma.CustomerAggregateArgs;
  count: Prisma.CustomerCountArgs;
  create: Prisma.CustomerCreateArgs;
  delete: Prisma.CustomerDeleteArgs;
  deleteMany: Prisma.CustomerDeleteManyArgs;
  findFirst: Prisma.CustomerFindFirstArgs;
  findMany: Prisma.CustomerFindManyArgs;
  findUnique: Prisma.CustomerFindUniqueArgs;
  update: Prisma.CustomerUpdateArgs;
  updateMany: Prisma.CustomerUpdateManyArgs;
  upsert: Prisma.CustomerUpsertArgs;
}
