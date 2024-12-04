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

  const { id: billId } = req.query;
  if (typeof billId !== 'string') {
    return res.status(400).json({ error: 'Invalid bill ID' });
  }

  if (req.method === 'GET') {
    try {
      const payments = await prisma.payment.findMany({
        where: { billId },
        orderBy: { paymentDate: 'desc' },
      });
      return res.status(200).json(payments);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch payments' });
    }
  }

  if (req.method === 'POST') {
    try {
      const payment = await prisma.payment.create({
        data: {
          ...req.body,
          billId,
          paymentDate: new Date(req.body.paymentDate || new Date()),
        },
      });

      // Update bill's paid amount and status
      const bill = await prisma.bill.findUnique({
        where: { id: billId },
        include: { payments: true },
      });

      if (bill) {
        const totalPaid = bill.payments.reduce((sum, p) => sum + p.amount, 0);
        await prisma.bill.update({
          where: { id: billId },
          data: {
            paidAmount: totalPaid,
            status: totalPaid >= bill.totalCost ? 'Paid' : 'Pending',
            updatedAt: new Date(),
          },
        });
      }

      return res.status(201).json(payment);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create payment' });
    }
  }

  if (req.method === 'DELETE') {
    const { paymentId } = req.query;
    if (typeof paymentId !== 'string') {
      return res.status(400).json({ error: 'Invalid payment ID' });
    }

    try {
      await prisma.payment.delete({
        where: { id: paymentId },
      });

      // Update bill's paid amount and status
      const bill = await prisma.bill.findUnique({
        where: { id: billId },
        include: { payments: true },
      });

      if (bill) {
        const totalPaid = bill.payments.reduce((sum, p) => sum + p.amount, 0);
        await prisma.bill.update({
          where: { id: billId },
          data: {
            paidAmount: totalPaid,
            status: totalPaid >= bill.totalCost ? 'Paid' : 'Pending',
            updatedAt: new Date(),
          },
        });
      }

      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete payment' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 