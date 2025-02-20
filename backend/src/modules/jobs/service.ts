import { db } from '../../db';
import { Prisma } from '@prisma/client';
import { InsertableJobData, UpdateableJobData } from './dtos';
import { ConflictError, NotFoundError } from '../../utils/errors/http-error';

export class JobService {
  static async findAll() {
    return db.job.findMany({
      where: { deletedAt: null },
    });
  }

  static async findById(id: string) {
    const job = await db.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundError('Job not found');
    }
    return job;
  }

  static async create(data: InsertableJobData) {
    try {
      return await db.job.create({ data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError('Job already exists');
      }
      throw error;
    }
  }

  static async update(id: string, data: UpdateableJobData) {
    try {
      return await db.job.update({ where: { id }, data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('Job not found');
      }
      throw error;
    }
  }

  static async delete(id: string) {
    try {
      return await db.job.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('Job not found');
      }
      throw error;
    }
  }
}
