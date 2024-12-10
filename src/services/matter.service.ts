import { prisma } from '@/lib/prisma';
import { Matter, MatterDeadline, MatterDocument } from '@/types/matter';
import { MatterStatus } from '@prisma/client';

export class MatterService {
  static async createMatter(data: Omit<Matter, 'id' | 'createdAt' | 'updatedAt'>) {
    const { name, client, status, notes, originatingAttorney, responsibleAttorney, courtLocation, practiceArea, caseNumber } = data;
    
    return prisma.matter.create({
      data: {
        name,
        client,
        status: status as MatterStatus,
        notes: notes || '',
        originatingAttorney,
        responsibleAttorney,
        courtLocation,
        practiceArea,
        caseNumber,
      },
      include: {
        deadlines: true,
        documents: true,
        subscribedAttorneys: true,
      },
    });
  }

  static async updateMatter(id: string, data: Partial<Matter>) {
    return prisma.matter.update({
      where: { id },
      data: {
        ...data,
        status: data.status as MatterStatus,
        updatedAt: new Date(),
      },
      include: {
        deadlines: true,
        documents: true,
        subscribedAttorneys: true,
      },
    });
  }

  static async deleteMatter(id: string) {
    await prisma.$transaction([
      prisma.matterDeadline.deleteMany({ where: { matterId: id } }),
      prisma.matterDocument.deleteMany({ where: { matterId: id } }),
      prisma.subscribedAttorney.deleteMany({ where: { matterId: id } }),
      prisma.matter.delete({ where: { id } }),
    ]);
  }

  static async getMatter(id: string) {
    return prisma.matter.findUnique({
      where: { id },
      include: {
        deadlines: true,
        documents: true,
        subscribedAttorneys: true,
        billableSessions: true,
        tasks: true,
      },
    });
  }

  static async getMatters(filters?: {
    status?: Matter['status'];
    client?: string;
    attorney?: string;
  }) {
    return prisma.matter.findMany({
      where: {
        status: filters?.status as MatterStatus,
        client: filters?.client,
        OR: filters?.attorney ? [
          { originatingAttorney: filters.attorney },
          { responsibleAttorney: filters.attorney },
        ] : undefined,
      },
      include: {
        deadlines: true,
        documents: true,
        subscribedAttorneys: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async addDeadline(matterId: string, data: Omit<MatterDeadline, 'id' | 'matterId'>) {
    return prisma.matterDeadline.create({
      data: {
        ...data,
        matterId,
      },
    });
  }

  static async addDocument(matterId: string, data: Omit<MatterDocument, 'id' | 'matterId' | 'uploadedAt'>) {
    return prisma.matterDocument.create({
      data: {
        ...data,
        matterId,
        uploadedAt: new Date(),
      },
    });
  }

  static async subscribeAttorney(matterId: string, attorneyName: string) {
    return prisma.subscribedAttorney.create({
      data: {
        matterId,
        attorneyName,
      },
    });
  }

  static async unsubscribeAttorney(matterId: string, attorneyName: string) {
    return prisma.subscribedAttorney.deleteMany({
      where: {
        matterId,
        attorneyName,
      },
    });
  }

  static async getMatterStats(matterId: string) {
    const [
      deadlines,
      documents,
      sessions,
      tasks
    ] = await Promise.all([
      prisma.matterDeadline.count({ where: { matterId } }),
      prisma.matterDocument.count({ where: { matterId } }),
      prisma.billableSession.count({ where: { matterId } }),
      prisma.task.count({ where: { matterId } }),
    ]);

    return {
      deadlines,
      documents,
      sessions,
      tasks,
    };
  }
} 