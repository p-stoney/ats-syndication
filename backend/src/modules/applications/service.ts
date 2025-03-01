import { createService } from '../../utils/createService';
import { InsertableApplicationData, UpdateableApplicationData } from './dtos';

/**
 * Creates a base CRUD service for the 'application' model.
 */
const base = createService<
  'application',
  InsertableApplicationData,
  UpdateableApplicationData
>('application');

export const ApplicationService = {
  ...base,

  // Model specific methods...
};
