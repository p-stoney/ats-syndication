import { z } from 'zod';

export const jobSchema = z.object({
  id: z.string().nonempty().optional(),
  organizationId: z.string().nonempty(),
  postedByUserId: z.string().nonempty(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  status: z.string().default('DRAFT'),
  publishedAt: z.date().nullable().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
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
