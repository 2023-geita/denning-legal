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
    return res.status(400).json({ error: 'Invalid bill ID' });
  }

  if (req.method === 'GET') {
    try {
      const bill = await prisma.bill.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              name: true,
            },
          },
          matter: {
            select: {
              name: true,
            },
          },
          payments: true,
        },
      });
      if (!bill) {
        return res.status(404).json({ error: 'Bill not found' });
      }
      return res.status(200).json(bill);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch bill' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const bill = await prisma.bill.update({
        where: { id },
        data: {
          ...req.body,
          updatedAt: new Date(),
        },
        include: {
          client: {
            select: {
              name: true,
            },
          },
          matter: {
            select: {
              name: true,
            },
          },
          payments: true,
        },
      });
      return res.status(200).json(bill);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update bill' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // First delete all related payments
      await prisma.payment.deleteMany({
        where: { billId: id },
      });
      // Then delete the bill
      await prisma.bill.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete bill' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 