import { z } from 'zod';

export const jobSchema = z.object({
  id: z.string().nonempty().optional(),
  orgId: z.string().nonempty(),
  postedByUserId: z.string().nonempty(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).default('DRAFT'),
  publishedAt: z.date().nullable().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const insertableJob = jobSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateableJob = insertableJob.partial();

export const parseJob = (data: unknown) => jobSchema.parse(data);
export const parseJobId = (id: unknown) => z.string().nonempty().parse(id);
export const parseInsertableJob = (data: unknown) => insertableJob.parse(data);
export const parseUpdateableJob = (data: unknown) => updateableJob.parse(data);

export const updateableSyndicate = z.object({
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED']).optional(),
  postedUrl: z.string().url().optional(),
});

export const parseUpdateableSynd = (data: unknown) =>
  updateableSyndicate.parse(data);

export const jobSearchQuery = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).optional(),
  orgId: z.string().optional(),
  postedByUserId: z.string().optional(),
});

export const parseJobSearchQuery = (query: unknown) =>
  jobSearchQuery.parse(query);

export type InsertableJobData = z.infer<typeof insertableJob>;
export type UpdateableJobData = z.infer<typeof updateableJob>;
export type UpdateableSyndData = z.infer<typeof updateableSyndicate>;
export type JobSearchFilters = z.infer<typeof jobSearchQuery>;
