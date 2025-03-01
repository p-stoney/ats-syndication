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

export const jobSyndUpdateSchema = z.object({
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED']).optional(),
  postedUrl: z.string().url().optional(),
});

export const jobSearchQuerySchema = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).optional(),
  orgId: z.string().optional(),
  postedByUserId: z.string().optional(),
});

export const insertable = jobSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateable = insertable.partial();

export type InsertableJobData = z.infer<typeof insertable>;
export type UpdateableJobData = z.infer<typeof updateable>;

export const parseJobId = (id: unknown) => z.string().nonempty().parse(id);
export const parseInsertableJobData = (data: unknown) => insertable.parse(data);
export const parseUpdateableJobData = (data: unknown) => updateable.parse(data);

export const parseJobData = (data: unknown) => jobSchema.parse(data);

export const parseUpdateableSyndData = (data: unknown) =>
  jobSyndUpdateSchema.parse(data);

export const parseJobSearchQuery = (query: unknown) =>
  jobSearchQuerySchema.parse(query);
