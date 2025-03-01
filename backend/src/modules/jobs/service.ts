import { createService } from '../../utils/createService';
import { InsertableJobData, UpdateableJobData } from './dtos';

/**
 * Creates a base CRUD service for the 'job' model.
 */
const base = createService<'job', InsertableJobData, UpdateableJobData>('job');

export const JobService = {
  ...base,

  async publishJob(id: string) {
    const job = await this.findById(id);
    if (job.status === 'PUBLISHED') {
      throw new Error('Already published');
    }
    return base.update(id, { status: 'PUBLISHED' });
  },
};
