import { NextApiRequest, NextApiResponse } from 'next';
import { Matter } from '@/types/matter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const matters = await prisma.matter.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      res.status(200).json(matters);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch matters' });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const matter: Omit<Matter, 'id' | 'createdAt' | 'updatedAt'> = req.body;
      
      const newMatter = await prisma.matter.create({
        data: {
          client: matter.client,
          status: matter.status,
          notes: matter.notes,
          originatingAttorney: matter.originatingAttorney,
          responsibleAttorney: matter.responsibleAttorney,
          courtLocation: matter.courtLocation,
          practiceArea: matter.practiceArea,
          caseNumber: matter.caseNumber,
        }
      });
      
      res.status(201).json(newMatter);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create matter' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 