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
      const documents = await prisma.document.findMany({
        orderBy: { uploadedAt: 'desc' },
        include: {
          versions: true,
        },
      });
      return res.status(200).json(documents);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }
  }

  if (req.method === 'POST') {
    try {
      const document = await prisma.document.create({
        data: {
          ...req.body,
          uploadedAt: new Date(),
          lastModified: new Date(),
        },
        include: {
          versions: true,
        },
      });
      return res.status(201).json(document);
    } catch (error) {
      console.error('Failed to create document:', error);
      return res.status(500).json({ error: 'Failed to create document' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 