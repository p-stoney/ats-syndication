import { createService } from '../../utils/createService';
import {
  InsertableUserData,
  UpdateableUserData,
  UserSearchFilters,
} from './dtos';
import { ConflictError } from '../../utils/errors/http-error';

/**
 * Creates a base CRUD service for the 'user' model.
 */
const base = createService<'user', InsertableUserData, UpdateableUserData>(
  'user'
);

export const UserService = {
  ...base,

  async searchUsers(filters: UserSearchFilters) {
    const where: any = { deletedAt: null };

    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }
    if (filters.firstName) {
      where.firstName = { contains: filters.firstName, mode: 'insensitive' };
    }
    if (filters.lastName) {
      where.lastName = { contains: filters.lastName, mode: 'insensitive' };
    }
    if (filters.role) {
      where.role = filters.role;
    }

    return this.findMany(where);
  },

  async setRole(id: string, newRole: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN') {
    const user = await this.findById(id);
    if (user.role === newRole) {
      throw new ConflictError(`User with ${id} already has role ${newRole}`);
    }
    return this.update(id, { role: newRole });
  },
};
