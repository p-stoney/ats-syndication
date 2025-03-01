import { createService } from '../../utils/createService';
import {
  InsertablePlatformData,
  UpdateablePlatformData,
  PlatformSearchFilters,
} from './dtos';
import { ConflictError } from '../../utils/errors/http-error';

/**
 * Creates a base CRUD service for the 'platform' model.
 */
const base = createService<
  'platform',
  InsertablePlatformData,
  UpdateablePlatformData
>('platform');

export const PlatformService = {
  ...base,

  async searchPlatforms(filters: PlatformSearchFilters) {
    const where: any = { deletedAt: null };

    if (filters.name)
      where.name = { contains: filters.name, mode: 'insensitive' };

    return this.findMany(where);
  },

  // Placeholder until integration with external APIs
  async pingPlatform(platformId: string) {
    const platform = await this.findById(platformId);
    if (!platform.apiUrl) {
      throw new ConflictError(`Platform ${platformId} has no apiUrl to ping`);
    }
    return {
      message: `Successfully pinged ${platform.name} at ${platform.apiUrl}`,
    };
  },
};
