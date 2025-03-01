import { createService } from '../../utils/createService';
import { InsertableUserData, UpdateableUserData } from './dtos';

/**
 * Creates a base CRUD service for the 'user' model.
 */
const base = createService<'user', InsertableUserData, UpdateableUserData>(
  'user'
);

export const UserService = {
  ...base,

  async promoteToEmployer(id: string) {
    return base.update(id, { role: 'EMPLOYER' });
  },
};
