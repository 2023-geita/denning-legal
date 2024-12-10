import { prisma } from '@/lib/prisma';
import { Task, TaskStats } from '@/types/task';

export class TaskService {
  static async createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.task.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        matter: {
          select: {
            name: true,
            client: true,
          },
        },
        assignedUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static async updateTask(id: string, data: Partial<Task>) {
    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        matter: {
          select: {
            name: true,
            client: true,
          },
        },
        assignedUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static async deleteTask(id: string) {
    await prisma.task.delete({
      where: { id },
    });
  }

  static async getTask(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        matter: {
          select: {
            name: true,
            client: true,
          },
        },
        assignedUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static async getTasks(filters?: {
    status?: Task['status'];
    priority?: Task['priority'];
    matterId?: string;
    assignedAttorney?: string;
    dueDate?: Date;
  }) {
    return prisma.task.findMany({
      where: {
        status: filters?.status,
        priority: filters?.priority,
        matterId: filters?.matterId,
        assignedAttorney: filters?.assignedAttorney,
        dueDate: filters?.dueDate ? {
          lte: filters.dueDate,
        } : undefined,
      },
      include: {
        matter: {
          select: {
            name: true,
            client: true,
          },
        },
        assignedUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { dueDate: 'asc' },
        { priority: 'desc' },
      ],
    });
  }

  static async getTaskStats(filters?: {
    matterId?: string;
    assignedAttorney?: string;
  }): Promise<TaskStats> {
    const tasks = await prisma.task.findMany({
      where: {
        matterId: filters?.matterId,
        assignedAttorney: filters?.assignedAttorney,
      },
    });

    const now = new Date();
    const stats: TaskStats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'Completed').length,
      pendingTasks: tasks.filter(t => t.status === 'Pending').length,
      overdueTasks: tasks.filter(t => 
        t.status === 'Pending' && 
        t.dueDate < now
      ).length,
      upcomingTasks: tasks.filter(t =>
        t.status === 'Pending' &&
        t.dueDate >= now &&
        t.dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
      ).length,
    };

    return stats;
  }

  static async getOverdueTasks() {
    const now = new Date();
    return prisma.task.findMany({
      where: {
        status: 'Pending',
        dueDate: {
          lt: now,
        },
      },
      include: {
        matter: {
          select: {
            name: true,
            client: true,
          },
        },
        assignedUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  static async getUpcomingTasks() {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return prisma.task.findMany({
      where: {
        status: 'Pending',
        dueDate: {
          gte: now,
          lte: nextWeek,
        },
      },
      include: {
        matter: {
          select: {
            name: true,
            client: true,
          },
        },
        assignedUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }
} 