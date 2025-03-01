import { z } from 'zod';

export const platformSchema = z.object({
  id: z.string().nonempty().optional(),
  name: z.string().min(1),
  apiUrl: z.string().url().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const insertablePlatform = platformSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateablePlatform = insertablePlatform.partial();

export const parsePlatform = (data: unknown) => platformSchema.parse(data);
export const parsePlatformId = (id: unknown) => z.string().nonempty().parse(id);
export const parseInsertablePlatform = (data: unknown) =>
  insertablePlatform.parse(data);
export const parseUpdateablePlatform = (data: unknown) =>
  updateablePlatform.parse(data);

export const platformSearchQuery = z.object({
  name: z.string().optional(),
});

export const parsePlatformSearchQuery = (query: unknown) =>
  platformSearchQuery.parse(query);

export type InsertablePlatformData = z.infer<typeof insertablePlatform>;
export type UpdateablePlatformData = z.infer<typeof updateablePlatform>;
export type PlatformSearchFilters = z.infer<typeof platformSearchQuery>;
