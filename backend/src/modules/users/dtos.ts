import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().nonempty().optional(),
  cognitoSub: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().default('CANDIDATE'),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const insertable = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateable = insertable.partial();

export type InsertableUserData = z.infer<typeof insertable>;
export type UpdateableUserData = z.infer<typeof updateable>;

export const parseUserId = (id: unknown) => z.string().nonempty().parse(id);
export const parseInsertableUserData = (data: unknown) =>
  insertable.parse(data);
export const parseUpdateableUserData = (data: unknown) =>
  updateable.parse(data);

export const parseUserData = (data: unknown) => userSchema.parse(data);
