import { Request } from 'express';

export enum ResponseMessage {
  SUCCESS = 'Request Successful',
  FAILED = 'Request Failed',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ProductCategory {
  DRAMA = 'Drama',
  COMEDY = 'Comedy',
  DOCUMENTARY = 'Documentary',
  HORROR = 'Horror',
  SCIFI = 'SciFi',
}

export interface PreviousDataDate {
  startDate: string;
  endDate: string;
}

export interface CrudMapType {
  aggregate: unknown;
  count: unknown;
  create: unknown | any;
  createMany?: unknown;
  delete: unknown;
  deleteMany: unknown;
  findFirst: unknown;
  findMany: unknown;
  findUnique: unknown;
  update: unknown;
  updateMany: unknown;
  upsert: unknown;
}

export interface Delegate {
  aggregate(data: unknown): unknown;
  count(data: unknown): any;
  create(data: unknown): unknown;
  createMany(data: unknown): unknown;
  delete(data: unknown): unknown;
  deleteMany(data: unknown): unknown;
  findFirst(data: unknown): any;
  findMany(data: unknown): any;
  findUnique(data: unknown): unknown;
  update(data: unknown): unknown;
  updateMany(data: unknown): unknown;
  upsert(data: unknown): unknown;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
  permittedFields?: any;
  selectFields?: any;
}
