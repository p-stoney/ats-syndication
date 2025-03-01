import { createService } from '../../utils/createService';
import { InsertableOrganizationData, UpdateableOrganizationData } from './dtos';

/**
 * Creates a base CRUD service for the 'organization' model.
 */
const base = createService<
  'organization',
  InsertableOrganizationData,
  UpdateableOrganizationData
>('organization');

export const OrganizationService = {
  ...base,

  // async renameOrg(id: string, newName: string) {
  //   return base.update(id, { name: newName });
  // }
};
