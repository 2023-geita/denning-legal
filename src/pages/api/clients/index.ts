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
      const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          bills: {
            select: {
              id: true,
              totalCost: true,
              paidAmount: true,
              status: true,
            },
          },
        },
      });
      return res.status(200).json(clients);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      return res.status(500).json({ error: 'Failed to fetch clients' });
    }
  }

  if (req.method === 'POST') {
    try {
      const client = await prisma.client.create({
        data: {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          bills: {
            select: {
              id: true,
              totalCost: true,
              paidAmount: true,
              status: true,
            },
          },
        },
      });
      return res.status(201).json(client);
    } catch (error) {
      console.error('Failed to create client:', error);
      return res.status(500).json({ error: 'Failed to create client' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 