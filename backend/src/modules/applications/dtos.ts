import { z } from 'zod';

export const applicationSchema = z.object({
  id: z.string().optional(),
  jobId: z.string(),
  candidateId: z.string(),
  platformId: z.string().optional(),
  status: z
    .enum(['APPLIED', 'REVIEWING', 'OFFERED', 'REJECTED'])
    .default('APPLIED'),
  resumeUrl: z.string().url().optional(),
  notes: z.string().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const insertableApp = applicationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateableApp = insertableApp.partial();

export const parseApplication = (data: unknown) =>
  applicationSchema.parse(data);
export const parseApplicationId = (id: unknown) => z.string().parse(id);
export const parseInsertableApplication = (data: unknown) =>
  insertableApp.parse(data);
export const parseUpdateableApplication = (data: unknown) =>
  updateableApp.parse(data);

export const appSearchQuery = z.object({
  jobId: z.string().optional(),
  candidateId: z.string().optional(),
  platformId: z.string().optional(),
  status: z.enum(['APPLIED', 'REVIEWING', 'OFFERED', 'REJECTED']).optional(),
});

export const parseAppSearchQuery = (query: unknown) =>
  appSearchQuery.parse(query);

export type InsertableApplicationData = z.infer<typeof insertableApp>;
export type UpdateableApplicationData = z.infer<typeof updateableApp>;
export type AppSearchFilters = z.infer<typeof appSearchQuery>;
