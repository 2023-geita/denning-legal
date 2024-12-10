import { prisma } from '@/lib/prisma';
import { Client, ClientStats, ClientMatter, ClientBilling } from '@/types/client';

export class ClientService {
  static async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.client.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  static async updateClient(id: string, data: Partial<Client>) {
    return prisma.client.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  static async deleteClient(id: string) {
    // First check if client has any active matters
    const activeMatters = await prisma.matter.count({
      where: {
        client: id,
        status: 'Open',
      },
    });

    if (activeMatters > 0) {
      throw new Error('Cannot delete client with active matters');
    }

    await prisma.$transaction([
      prisma.payment.deleteMany({
        where: {
          bill: {
            clientId: id,
          },
        },
      }),
      prisma.bill.deleteMany({
        where: { clientId: id },
      }),
      prisma.client.delete({
        where: { id },
      }),
    ]);
  }

  static async getClient(id: string) {
    return prisma.client.findUnique({
      where: { id },
    });
  }

  static async getClients(filters?: {
    type?: Client['type'];
    status?: Client['status'];
    responsibleAttorney?: string;
  }) {
    return prisma.client.findMany({
      where: {
        type: filters?.type,
        status: filters?.status,
        responsibleAttorney: filters?.responsibleAttorney,
      },
      orderBy: { name: 'asc' },
    });
  }

  static async getClientStats(filters?: {
    responsibleAttorney?: string;
  }): Promise<ClientStats> {
    const clients = await prisma.client.findMany({
      where: {
        responsibleAttorney: filters?.responsibleAttorney,
      },
    });

    const stats: ClientStats = {
      totalClients: clients.length,
      activeClients: clients.filter(c => c.status === 'Active').length,
      inactiveClients: clients.filter(c => c.status === 'Inactive').length,
      individualClients: clients.filter(c => c.type === 'Individual').length,
      companyClients: clients.filter(c => c.type === 'Company').length,
    };

    return stats;
  }

  static async getClientMatters(clientId: string): Promise<ClientMatter[]> {
    const matters = await prisma.matter.findMany({
      where: {
        client: clientId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return matters.map(matter => ({
      id: matter.id,
      clientId,
      matterName: matter.name,
      status: matter.status,
      startDate: matter.createdAt,
      lastActivity: matter.updatedAt,
    }));
  }

  static async getClientBilling(clientId: string): Promise<ClientBilling> {
    const bills = await prisma.bill.findMany({
      where: { clientId },
      include: { payments: true },
    });

    const totalBilled = bills.reduce((sum, bill) => sum + bill.totalCost, 0);
    const totalPaid = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
    const outstandingAmount = totalBilled - totalPaid;

    const lastPayment = await prisma.payment.findFirst({
      where: {
        bill: {
          clientId,
        },
      },
      orderBy: { paymentDate: 'desc' },
    });

    return {
      id: clientId,
      clientId,
      totalBilled,
      totalPaid,
      outstandingAmount,
      lastPaymentDate: lastPayment?.paymentDate,
    };
  }

  static async searchClients(query: string) {
    return prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
        ],
      },
      orderBy: { name: 'asc' },
    });
  }
} 