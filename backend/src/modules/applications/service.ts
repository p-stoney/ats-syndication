import { db } from '@backend/db';
import { createService } from '../../utils/createService';
import {
  InsertableApplicationData,
  UpdateableApplicationData,
  AppSearchFilters,
} from './dtos';

/**
 * Creates a base CRUD service for the 'application' model.
 */
const base = createService<
  'application',
  InsertableApplicationData,
  UpdateableApplicationData
>('application');

export const AppsService = {
  ...base,

  async searchApplications(filters: AppSearchFilters) {
    const where: any = { deletedAt: null };

    if (filters.jobId) where.jobId = filters.jobId;
    if (filters.candidateId) where.candidateId = filters.candidateId;
    if (filters.platformId) where.platformId = filters.platformId;
    if (filters.status) where.status = filters.status;

    return this.findMany(where);
  },

  async reviewApplication(
    appId: string,
    newStatus: 'REVIEWING' | 'OFFERED' | 'REJECTED'
  ) {
    return this.update(appId, { status: newStatus });
  },
};
