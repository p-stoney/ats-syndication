import { z } from 'zod';

export const organizationSchema = z.object({
  id: z.string().nonempty().optional(),
  name: z.string().min(1),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const insertableOrg = organizationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateableOrg = insertableOrg.partial();

export const parseOrg = (data: unknown) => organizationSchema.parse(data);
export const parseOrgId = (id: unknown) => z.string().nonempty().parse(id);
export const parseInsertableOrg = (data: unknown) => insertableOrg.parse(data);
export const parseUpdateableOrg = (data: unknown) => updateableOrg.parse(data);

export const orgSearchQuery = z.object({
  name: z.string().optional(),
});

export const parseOrgSearchQuery = (query: unknown) =>
  orgSearchQuery.parse(query);

export type InsertableOrgData = z.infer<typeof insertableOrg>;
export type UpdateableOrgData = z.infer<typeof updateableOrg>;
export type OrgSearchFilters = z.infer<typeof orgSearchQuery>;
