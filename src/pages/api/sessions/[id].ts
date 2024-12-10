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
    return res.status(400).json({ error: 'Invalid session ID' });
  }

  if (req.method === 'GET') {
    try {
      const billableSession = await prisma.billableSession.findUnique({
        where: { id },
      });

      if (!billableSession) {
        return res.status(404).json({ error: 'Session not found' });
      }

      return res.status(200).json(billableSession);
    } catch (error) {
      console.error('Failed to fetch session:', error);
      return res.status(500).json({ error: 'Failed to fetch session' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const billableSession = await prisma.billableSession.update({
        where: { id },
        data: {
          ...req.body,
        },
      });
      return res.status(200).json(billableSession);
    } catch (error) {
      console.error('Failed to update session:', error);
      return res.status(500).json({ error: 'Failed to update session' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.billableSession.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (error) {
      console.error('Failed to delete session:', error);
      return res.status(500).json({ error: 'Failed to delete session' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 