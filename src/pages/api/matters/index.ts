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
      const matters = await prisma.matter.findMany({
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return res.status(200).json(matters);
    } catch (error) {
      console.error('Failed to fetch matters:', error);
      return res.status(500).json({ error: 'Failed to fetch matters' });
    }
  }

  if (req.method === 'POST') {
    try {
      const matter = await prisma.matter.create({
        data: {
          ...req.body,
          createdAt: new Date(),
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
      return res.status(201).json(matter);
    } catch (error) {
      console.error('Failed to create matter:', error);
      return res.status(500).json({ error: 'Failed to create matter' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 