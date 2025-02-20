import { db } from '../../db';
import { InsertableJobData } from './dtos';
import { Prisma } from '@prisma/client';

export class JobService {
  static async createJob(data: InsertableJobData) {
    try {
      return db.job.create({ data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw error;
    }
  }
}
