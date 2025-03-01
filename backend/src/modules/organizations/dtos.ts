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

export type InsertableOrgData = z.infer<typeof insertable>;
export type UpdateableOrgData = z.infer<typeof updateable>;

export const parseOrgId = (raw: unknown) => z.string().nonempty().parse(raw);
export const parseInsertableOrgData = (raw: unknown) => insertable.parse(raw);
export const parseUpdateableOrgData = (raw: unknown) => updateable.parse(raw);

export const parseOrgData = (raw: unknown) => organizationSchema.parse(raw);
