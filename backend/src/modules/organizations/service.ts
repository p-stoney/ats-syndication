import { db } from '../../db';
import { createService } from '../../utils/createService';
import { InsertableOrgData, UpdateableOrgData, OrgSearchFilters } from './dtos';
import { PrismaClientKnownRequestError as PrismaError } from '@prisma/client/runtime/library';
import { ConflictError } from '../../utils/errors/http-error';

/**
 * Creates a base CRUD service for the 'organization' model.
 */
const base = createService<
  'organization',
  InsertableOrgData,
  UpdateableOrgData
>('organization');

export const OrgService = {
  ...base,

  async searchOrgs(filters: OrgSearchFilters) {
    const where: any = { deletedAt: null };
    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }
    return this.findMany(where);
  },

  async renameOrg(orgId: string, newName: string) {
    const org = await this.findById(orgId);
    if (org.name === newName) {
      throw new ConflictError(
        `Organization with ID ${orgId} already has the name ${newName}`
      );
    }
    return this.update(orgId, { name: newName });
  },

  async listMembers(orgId: string) {
    const members = await db.organizationUser.findMany({
      where: {
        orgId,
        deletedAt: null,
      },
      include: { user: true },
    });
    return members;
  },

  async addMember(orgId: string, userId: string) {
    try {
      const newMember = await db.organizationUser.create({
        data: {
          orgId: orgId,
          userId: userId,
        },
      });
      return newMember;
    } catch (error) {
      if (error instanceof PrismaError && error.code === 'P2002') {
        throw new ConflictError(
          `User with ID ${userId}  is already a member of organization with ID ${orgId}`
        );
      }
      throw error;
    }
  },

  async removeMember(orgId: string, userId: string) {
    try {
      const softDeleted = await db.organizationUser.update({
        where: {
          orgId_userId: {
            orgId: orgId,
            userId: userId,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });
      return softDeleted;
    } catch (error) {
      throw error;
    }
  },
};
