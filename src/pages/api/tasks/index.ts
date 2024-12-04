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

  if (req.method === 'GET') {
    try {
      const tasks = await prisma.task.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          matter: {
            select: {
              name: true,
            },
          },
        },
      });
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }

  if (req.method === 'POST') {
    try {
      const task = await prisma.task.create({
        data: {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create task' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 