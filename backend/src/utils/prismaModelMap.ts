import { db } from '../db';

/**
 * List of valid model names in Prisma schema, as a union.
 */
export type ModelName =
  | 'user'
  | 'organization'
  | 'organizationUser'
  | 'job'
  | 'application'
  | 'platform'
  | 'jobSyndication';

/**
 * A typed object mapping each ModelName to its Prisma delegate instance.
 */
export const modelDelegates: Record<ModelName, any> = {
  user: db.user,
  organization: db.organization,
  organizationUser: db.organizationUser,
  job: db.job,
  application: db.application,
  platform: db.platform,
  jobSyndication: db.jobSyndication,
};
