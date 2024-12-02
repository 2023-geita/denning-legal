import { NextApiRequest, NextApiResponse } from 'next';
import { MatterDocument } from '@/types/matter';
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
      const documents = await prisma.matterDocument.findMany({
        where: { matterId },
        orderBy: {
          uploadedAt: 'desc'
        }
      });

      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  }

  else if (req.method === 'POST') {
    try {
      const document: Omit<MatterDocument, 'id' | 'uploadedAt'> = {
        ...req.body,
        matterId
      };

      const newDocument = await prisma.matterDocument.create({
        data: {
          ...document,
          uploadedAt: new Date()
        }
      });

      res.status(201).json(newDocument);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create document' });
    }
  }

  else if (req.method === 'PUT') {
    try {
      const updates = req.body;
      const { documentId } = req.query;

      if (typeof documentId !== 'string') {
        return res.status(400).json({ error: 'Invalid document ID' });
      }

      const updatedDocument = await prisma.matterDocument.update({
        where: { id: documentId },
        data: updates
      });

      res.status(200).json(updatedDocument);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update document' });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const { documentId } = req.query;

      if (typeof documentId !== 'string') {
        return res.status(400).json({ error: 'Invalid document ID' });
      }

      await prisma.matterDocument.delete({
        where: { id: documentId }
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete document' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 