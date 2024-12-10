import { prisma } from '@/lib/prisma';
import { Document, DocumentVersion, DocumentStats, DocumentType } from '@/types/document';

export class DocumentService {
  static async createDocument(data: Omit<Document, 'id' | 'uploadedAt' | 'lastModified'>) {
    return prisma.document.create({
      data: {
        ...data,
        uploadedAt: new Date(),
        lastModified: new Date(),
      },
      include: {
        versions: true,
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static async updateDocument(id: string, data: Partial<Document>) {
    return prisma.document.update({
      where: { id },
      data: {
        ...data,
        lastModified: new Date(),
      },
      include: {
        versions: {
          orderBy: { version: 'desc' },
        },
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static async deleteDocument(id: string) {
    await prisma.$transaction([
      prisma.documentVersion.deleteMany({ where: { documentId: id } }),
      prisma.document.delete({ where: { id } }),
    ]);
  }

  static async getDocument(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { version: 'desc' },
        },
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static async getDocuments(filters?: {
    type?: DocumentType;
    matterId?: string;
    uploadedBy?: string;
    status?: Document['status'];
    tags?: string[];
  }) {
    return prisma.document.findMany({
      where: {
        type: filters?.type,
        matterId: filters?.matterId,
        uploadedBy: filters?.uploadedBy,
        status: filters?.status,
        tags: filters?.tags ? {
          hasEvery: filters.tags,
        } : undefined,
      },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { lastModified: 'desc' },
    });
  }

  static async addVersion(documentId: string, data: Omit<DocumentVersion, 'id' | 'documentId' | 'uploadedAt'>) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    const latestVersion = document.versions[0]?.version || 0;

    return prisma.$transaction([
      prisma.documentVersion.create({
        data: {
          ...data,
          documentId,
          version: latestVersion + 1,
          uploadedAt: new Date(),
        },
      }),
      prisma.document.update({
        where: { id: documentId },
        data: {
          lastModified: new Date(),
          fileUrl: data.fileUrl,
          fileSize: data.fileSize,
        },
      }),
    ]);
  }

  static async getDocumentStats(filters?: {
    matterId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<DocumentStats> {
    const documents = await prisma.document.findMany({
      where: {
        matterId: filters?.matterId,
        uploadedAt: {
          gte: filters?.startDate,
          lte: filters?.endDate,
        },
      },
    });

    const stats: DocumentStats = {
      totalDocuments: documents.length,
      uploadedDocuments: documents.filter(d => d.status === 'Uploaded').length,
      draftedDocuments: documents.filter(d => d.status === 'Drafted').length,
      documentsByType: documents.reduce((acc, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
        return acc;
      }, {} as Record<DocumentType, number>),
    };

    return stats;
  }

  static async searchDocuments(query: string) {
    return prisma.document.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { lastModified: 'desc' },
    });
  }
} 