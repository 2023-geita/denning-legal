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
    return res.status(400).json({ error: 'Invalid matter ID' });
  }

  if (req.method === 'GET') {
    try {
      const matter = await prisma.matter.findUnique({
        where: { id },
        include: {
          deadlines: true,
          subscribedAttorneys: true,
          assignedUsers: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      });

      if (!matter) {
        return res.status(404).json({ error: 'Matter not found' });
      }

      return res.status(200).json(matter);
    } catch (error) {
      console.error('Failed to fetch matter:', error);
      return res.status(500).json({ error: 'Failed to fetch matter' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const matter = await prisma.matter.update({
        where: { id },
        data: {
          ...req.body,
          updatedAt: new Date()
        },
        include: {
          deadlines: true,
          subscribedAttorneys: true,
          assignedUsers: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      });
      return res.status(200).json(matter);
    } catch (error) {
      console.error('Failed to update matter:', error);
      return res.status(500).json({ error: 'Failed to update matter' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.matter.delete({
        where: { id }
      });
      return res.status(204).end();
    } catch (error) {
      console.error('Failed to delete matter:', error);
      return res.status(500).json({ error: 'Failed to delete matter' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 