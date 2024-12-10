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
    return res.status(400).json({ error: 'Invalid document ID' });
  }

  if (req.method === 'GET') {
    try {
      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          versions: true,
        },
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      return res.status(200).json(document);
    } catch (error) {
      console.error('Failed to fetch document:', error);
      return res.status(500).json({ error: 'Failed to fetch document' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const document = await prisma.document.update({
        where: { id },
        data: {
          ...req.body,
          updatedAt: new Date(),
        },
        include: {
          versions: true,
        },
      });
      return res.status(200).json(document);
    } catch (error) {
      console.error('Failed to update document:', error);
      return res.status(500).json({ error: 'Failed to update document' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.documentVersion.deleteMany({
        where: { documentId: id },
      });
      await prisma.document.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (error) {
      console.error('Failed to delete document:', error);
      return res.status(500).json({ error: 'Failed to delete document' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 