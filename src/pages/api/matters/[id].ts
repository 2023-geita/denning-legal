import { NextApiRequest, NextApiResponse } from 'next';
import { Matter } from '@/types/matter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
          documents: true,
          subscribedAttorneys: true
        }
      });

      if (!matter) {
        return res.status(404).json({ error: 'Matter not found' });
      }

      res.status(200).json(matter);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch matter' });
    }
  }

  else if (req.method === 'PUT') {
    try {
      const updates: Partial<Matter> = req.body;
      
      const updatedMatter = await prisma.matter.update({
        where: { id },
        data: {
          client: updates.client,
          status: updates.status,
          notes: updates.notes,
          originatingAttorney: updates.originatingAttorney,
          responsibleAttorney: updates.responsibleAttorney,
          courtLocation: updates.courtLocation,
          practiceArea: updates.practiceArea,
          caseNumber: updates.caseNumber,
        }
      });

      res.status(200).json(updatedMatter);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update matter' });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      await prisma.matter.delete({
        where: { id }
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete matter' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 