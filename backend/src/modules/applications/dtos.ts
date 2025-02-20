import { z } from 'zod';

export const applicationSchema = z.object({
  id: z.string().optional(),
  jobId: z.string(),
  candidateId: z.string(),
  status: z.string().default('APPLIED'),
  resumeUrl: z.string().url().optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const insertable = applicationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateable = insertable.partial();

export type InsertableApplicationData = z.infer<typeof insertable>;
export type UpdateableApplicationData = z.infer<typeof updateable>;

export const parseApplicationData = (data: unknown) =>
  applicationSchema.parse(data);

export const parseApplicationId = (id: unknown) => z.string().parse(id);

export const parseInsertableApplicationData = (data: unknown) =>
  insertable.parse(data);

export const parseUpdateableApplicationData = (data: unknown) =>
  updateable.parse(data);
