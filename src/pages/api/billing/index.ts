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
      const bills = await prisma.bill.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: {
              name: true,
            },
          },
          payments: true,
        },
      });
      return res.status(200).json(bills);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch bills' });
    }
  }

  if (req.method === 'POST') {
    try {
      const bill = await prisma.bill.create({
        data: {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          client: {
            select: {
              name: true,
            },
          },
          payments: true,
        },
      });
      return res.status(201).json(bill);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create bill' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 