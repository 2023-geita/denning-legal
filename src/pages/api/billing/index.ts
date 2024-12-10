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
          matter: {
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
    const { clientId, matterId, totalCost, paidAmount, retainerFee, retainerDue, dueDate } = req.body;
    if (!clientId || !matterId || !totalCost || !dueDate) {
      return res.status(400).json({ error: 'Missing required fields: clientId, matterId, totalCost, dueDate' });
    }

    try {
      const newBill = await prisma.bill.create({
        data: {
          clientId,
          matterId,
          totalCost,
          paidAmount,
          retainerFee,
          retainerDue,
          dueDate,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return res.status(201).json(newBill);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create bill' });
    }
  }

  if (req.method === 'PUT') {
    const { clientId, matterId, totalCost, retainerFee, dueDate } = req.body;
    if (!clientId || !matterId || !totalCost || !dueDate) {
      return res.status(400).json({ error: 'Missing required fields: clientId, matterId, totalCost, dueDate' });
    }

    try {
      const bill = await prisma.bill.update({
        where: { id: req.query.id },
        data: {
          ...req.body,
          updatedAt: new Date(),
        },
        include: {
          client: { select: { name: true } },
          matter: { select: { name: true } },
        },
      });
      return res.status(200).json(bill);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update bill: ' + error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}