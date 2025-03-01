import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().nonempty().optional(),
  cognitoSub: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['CANDIDATE', 'EMPLOYER', 'ADMIN']).default('CANDIDATE'),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const insertableUser = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateableUser = insertableUser.partial();

export const parseUser = (data: unknown) => userSchema.parse(data);
export const parseUserId = (id: unknown) => z.string().nonempty().parse(id);
export const parseInsertableUser = (data: unknown) =>
  insertableUser.parse(data);
export const parseUpdateableUser = (data: unknown) =>
  updateableUser.parse(data);

export const userSearchQuerySchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['CANDIDATE', 'EMPLOYER', 'ADMIN']).optional(),
});

export const parseUserSearchQuery = (query: unknown) =>
  userSearchQuerySchema.parse(query);

export type InsertableUserData = z.infer<typeof insertableUser>;
export type UpdateableUserData = z.infer<typeof updateableUser>;
export type UserSearchFilters = z.infer<typeof userSearchQuerySchema>;
