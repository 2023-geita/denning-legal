import { NextApiRequest, NextApiResponse } from 'next';
import { MatterDeadline } from '@/types/matter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: matterId } = req.query;

  if (typeof matterId !== 'string') {
    return res.status(400).json({ error: 'Invalid matter ID' });
  }

  if (req.method === 'GET') {
    try {
      const deadlines = await prisma.matterDeadline.findMany({
        where: { matterId }
      });

      res.status(200).json(deadlines);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch deadlines' });
    }
  }

  else if (req.method === 'POST') {
    try {
      const deadline: Omit<MatterDeadline, 'id'> = {
        ...req.body,
        matterId
      };

      const newDeadline = await prisma.matterDeadline.create({
        data: deadline
      });

      res.status(201).json(newDeadline);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create deadline' });
    }
  }

  else if (req.method === 'PUT') {
    try {
      const updates = req.body;
      const { deadlineId } = req.query;

      if (typeof deadlineId !== 'string') {
        return res.status(400).json({ error: 'Invalid deadline ID' });
      }

      const updatedDeadline = await prisma.matterDeadline.update({
        where: { id: deadlineId },
        data: updates
      });

      res.status(200).json(updatedDeadline);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update deadline' });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const { deadlineId } = req.query;

      if (typeof deadlineId !== 'string') {
        return res.status(400).json({ error: 'Invalid deadline ID' });
      }

      await prisma.matterDeadline.delete({
        where: { id: deadlineId }
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete deadline' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 