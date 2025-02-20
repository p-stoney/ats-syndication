import { db } from '../../db';
import { PrismaClientKnownRequestError as PrismaError } from '@prisma/client/runtime/library';
import { ConflictError, NotFoundError } from '../../utils/errors/http-error';
import { InsertableApplicationData, UpdateableApplicationData } from './dtos';

export class ApplicationService {
  static async findAll() {
    return db.application.findMany({
      where: { deletedAt: null },
    });
  }

  static async findById(id: string) {
    const application = await db.application.findUnique({ where: { id } });
    if (!application) {
      throw new NotFoundError('Application not found');
    }
    return application;
  }

  static async create(data: InsertableApplicationData) {
    try {
      return await db.application.create({ data });
    } catch (error) {
      if (error instanceof PrismaError && error.code === 'P2002') {
        throw new ConflictError('Application already exists');
      }
      throw error;
    }
  }

  static async update(id: string, data: UpdateableApplicationData) {
    try {
      return await db.application.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof PrismaError && error.code === 'P2025') {
        throw new NotFoundError('Application not found');
      }
      throw error;
    }
  }

  static async delete(id: string) {
    try {
      return await db.application.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (error instanceof PrismaError && error.code === 'P2025') {
        throw new NotFoundError('Application not found');
      }
      throw error;
    }
  }
}
