import { createService } from '../../utils/createService';
import { InsertableApplicationData, UpdateableApplicationData } from './dtos';

// Generic service implementing the basic CRUD operations
const base = createService<
  'application',
  InsertableApplicationData,
  UpdateableApplicationData
>('application');

export const ApplicationService = {
  ...base,

  // Model specific methods...
};
