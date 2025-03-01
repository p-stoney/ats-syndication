import { modelDelegates, ModelName } from './prismaModelMap';
import { PrismaClientKnownRequestError as PrismaError } from '@prisma/client/runtime/library';
import { ConflictError, NotFoundError } from './errors/http-error';
import { capitalize } from './helpers';

export interface ServiceOptions {
  findAllFilter?: Record<string, unknown>;
  softDelete?: boolean;
}

export function createService<M extends ModelName, TCreate, TUpdate>(
  modelName: M,
  options?: ServiceOptions
) {
  const { findAllFilter = { deletedAt: null }, softDelete = true } =
    options || {};

  const delegate = modelDelegates[modelName];
  const capitalizedModel = capitalize(modelName);

  return {
    async findAll() {
      return delegate.findMany({
        where: findAllFilter,
      });
    },

    async findMany(filter: Record<string, unknown>) {
      return delegate.findMany({ where: { ...findAllFilter, ...filter } });
    },

    async findById(id: string) {
      const model = await delegate.findUnique({ where: { id } });
      if (!model) {
        throw new NotFoundError(`${capitalizedModel} not found`);
      }
      return model;
    },

    async create(data: TCreate) {
      try {
        return await delegate.create({ data });
      } catch (error) {
        if (error instanceof PrismaError && error.code === 'P2002') {
          throw new ConflictError(`${capitalizedModel} already exists`);
        }
        throw error;
      }
    },

    async update(id: string, data: TUpdate) {
      try {
        return await delegate.update({
          where: { id },
          data,
        });
      } catch (error) {
        throw error;
      }
    },

    async delete(id: string) {
      try {
        if (softDelete) {
          return await delegate.update({
            where: { id },
            data: { deletedAt: new Date() },
          });
        } else {
          return await delegate.delete({ where: { id } });
        }
      } catch (error) {
        throw error;
      }
    },
  };
}
