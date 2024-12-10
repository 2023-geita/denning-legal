import { prisma } from '@/lib/prisma';
import { BillableSession, SessionStats } from '@/types/session';

export class SessionService {
  static async createSession(data: Omit<BillableSession, 'id' | 'duration'>) {
    const duration = data.endTime 
      ? Math.round((data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60))
      : 0;

    return prisma.billableSession.create({
      data: {
        ...data,
        duration,
      },
      include: {
        matter: {
          select: {
            name: true,
            client: true,
          },
        },
      },
    });
  }

  static async updateSession(id: string, data: Partial<BillableSession>) {
    let duration = undefined;
    if (data.startTime || data.endTime) {
      const session = await prisma.billableSession.findUnique({
        where: { id },
        select: {
          startTime: true,
          endTime: true,
        },
      });

      if (session) {
        const startTime = data.startTime || session.startTime;
        const endTime = data.endTime || session.endTime;
        
        if (endTime) {
          duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
        }
      }
    }

    return prisma.billableSession.update({
      where: { id },
      data: {
        ...data,
        duration,
      },
      include: {
        matter: {
          select: {
            name: true,
            client: true,
          },
        },
      },
    });
  }

  static async deleteSession(id: string) {
    await prisma.billableSession.delete({
      where: { id },
    });
  }

  static async getSession(id: string) {
    return prisma.billableSession.findUnique({
      where: { id },
      include: {
        matter: {
          select: {
            name: true,
            client: true,
          },
        },
      },
    });
  }

  static async getSessions(filters?: {
    status?: BillableSession['status'];
    matterId?: string;
    attorney?: string;
    startDate?: Date;
    endDate?: Date;
    billable?: boolean;
  }) {
    return prisma.billableSession.findMany({
      where: {
        status: filters?.status,
        matterId: filters?.matterId,
        attorney: filters?.attorney,
        date: {
          gte: filters?.startDate,
          lte: filters?.endDate,
        },
        billable: filters?.billable,
      },
      include: {
        matter: {
          select: {
            name: true,
            client: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  static async getSessionStats(filters?: {
    matterId?: string;
    attorney?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<SessionStats> {
    const sessions = await prisma.billableSession.findMany({
      where: {
        matterId: filters?.matterId,
        attorney: filters?.attorney,
        date: {
          gte: filters?.startDate,
          lte: filters?.endDate,
        },
      },
    });

    const stats: SessionStats = {
      totalHours: sessions.reduce((sum, s) => sum + (s.duration / 60), 0),
      billableHours: sessions
        .filter(s => s.billable)
        .reduce((sum, s) => sum + (s.duration / 60), 0),
      totalSessions: sessions.length,
      averageSessionDuration: sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
        : 0,
    };

    return stats;
  }

  static async startSession(data: Omit<BillableSession, 'id' | 'endTime' | 'duration'>) {
    return this.createSession({
      ...data,
      status: 'Ongoing',
      startTime: new Date(),
    });
  }

  static async endSession(id: string) {
    const endTime = new Date();
    return this.updateSession(id, {
      endTime,
      status: 'Completed',
    });
  }

  static async pauseSession(id: string) {
    return this.updateSession(id, {
      status: 'Paused',
      endTime: new Date(),
    });
  }

  static async resumeSession(id: string) {
    const session = await this.getSession(id);
    if (!session) {
      throw new Error('Session not found');
    }

    // Calculate previous duration
    const previousDuration = session.duration;

    return this.updateSession(id, {
      status: 'Ongoing',
      startTime: new Date(),
      // Add previous duration to maintain total time
      duration: previousDuration,
    });
  }
} 