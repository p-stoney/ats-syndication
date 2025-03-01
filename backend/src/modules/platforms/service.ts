import { createService } from '../../utils/createService';
import { InsertablePlatformData, UpdateablePlatformData } from './dtos';

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

  // async pingPlatform(id: string) {
  //   const platform = await this.findById(id);
  //   if (!platform) throw new NotFoundError('Platform not found');
  //   // do some logic, e.g. fetch(platform.apiUrl)
  // }
};
