import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  if (req.method === 'GET') {
    try {
      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          matter: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch task' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const task = await prisma.task.update({
        where: { id },
        data: {
          ...req.body,
          updatedAt: new Date(),
        },
      });
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update task' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.task.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete task' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 