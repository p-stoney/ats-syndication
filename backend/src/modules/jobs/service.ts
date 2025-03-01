import { db } from '@backend/db';
import { createService } from '../../utils/createService';
import {
  InsertableJobData,
  UpdateableJobData,
  UpdateableSyndData,
  JobSearchFilters,
} from './dtos';
import { PrismaClientKnownRequestError as PrismaError } from '@prisma/client/runtime/library';
import { ConflictError } from '../../utils/errors/http-error';

/**
 * Creates a base CRUD service for the 'job' model.
 */
const base = createService<'job', InsertableJobData, UpdateableJobData>('job');

export const JobService = {
  ...base,

  async searchJobs(filters: JobSearchFilters) {
    const where: any = { deletedAt: null };

    if (filters.title)
      where.title = { contains: filters.title, mode: 'insensitive' };
    if (filters.location)
      where.location = { contains: filters.location, mode: 'insensitive' };
    if (filters.status) where.status = filters.status;
    if (filters.orgId) where.orgId = filters.orgId;
    if (filters.postedByUserId) where.postedByUserId = filters.postedByUserId;

    return this.findMany(where);
  },

  async publishJob(jobId: string) {
    const job = await this.findById(jobId);
    if (job.status === 'PUBLISHED') {
      throw new ConflictError(`Job with ${jobId} is already published`);
    }
    return this.update(jobId, { status: 'PUBLISHED', publishedAt: new Date() });
  },

  async closeJob(jobId: string) {
    const job = await this.findById(jobId);
    if (job.status === 'CLOSED') {
      throw new ConflictError(`Job with ${jobId} is already closed`);
    }
    return this.update(jobId, { status: 'CLOSED' });
  },

  async assignOrg(jobId: string, orgId: string) {
    return this.update(jobId, { orgId });
  },

  async listSyndications(jobId: string) {
    const syndications = await db.jobSyndication.findMany({
      where: {
        jobId,
        deletedAt: null,
      },
      include: { platform: true },
    });
    return syndications;
  },

  async addSyndication(jobId: string, platformId: string) {
    try {
      const job = await this.findById(jobId);
      if (job.status !== 'PUBLISHED') {
        throw new ConflictError(`Job with ${jobId} is not published`);
      }
      const newSynd = await db.jobSyndication.create({
        data: {
          jobId,
          platformId,
          status: 'PENDING',
        },
      });
      return newSynd;
    } catch (error) {
      if (error instanceof PrismaError && error.code === 'P2002') {
        throw new ConflictError(
          `Syndication with platform ID ${platformId} is already associated with job ID ${jobId}`
        );
      }
      throw error;
    }
  },

  async updateSyndication(
    jobId: string,
    platformId: string,
    updates: UpdateableSyndData
  ) {
    try {
      const updatedSynd = await db.jobSyndication.update({
        where: {
          jobId_platformId: {
            jobId,
            platformId,
          },
        },
        data: updates,
      });
      return updatedSynd;
    } catch (error) {
      throw error;
    }
  },

  async removeSyndication(jobId: string, platformId: string) {
    try {
      const softDeleted = await db.jobSyndication.update({
        where: {
          jobId_platformId: {
            jobId,
            platformId,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });
      return softDeleted;
    } catch (error) {
      throw error;
    }
  },
};
