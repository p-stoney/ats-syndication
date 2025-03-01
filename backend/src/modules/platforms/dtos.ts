import { z } from 'zod';

export const platformSchema = z.object({
  id: z.string().nonempty().optional(),
  name: z.string().min(1),
  apiUrl: z.string().url().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const insertable = platformSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateable = insertable.partial();

export type InsertablePlatformData = z.infer<typeof insertable>;
export type UpdateablePlatformData = z.infer<typeof updateable>;

export const parsePlatformId = (raw: unknown) =>
  z.string().nonempty().parse(raw);
export const parseInsertablePlatformData = (raw: unknown) =>
  insertable.parse(raw);
export const parseUpdateablePlatformData = (raw: unknown) =>
  updateable.parse(raw);

export const parsePlatformData = (raw: unknown) => platformSchema.parse(raw);
