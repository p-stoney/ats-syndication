import { z } from 'zod';

export const organizationSchema = z.object({
  id: z.string().nonempty().optional(),
  name: z.string().min(1),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const insertable = organizationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateable = insertable.partial();

export type InsertableOrganizationData = z.infer<typeof insertable>;
export type UpdateableOrganizationData = z.infer<typeof updateable>;

export const parseOrganizationId = (raw: unknown) =>
  z.string().nonempty().parse(raw);
export const parseInsertableOrganizationData = (raw: unknown) =>
  insertable.parse(raw);
export const parseUpdateableOrganizationData = (raw: unknown) =>
  updateable.parse(raw);

export const parseOrganizationData = (raw: unknown) =>
  organizationSchema.parse(raw);
