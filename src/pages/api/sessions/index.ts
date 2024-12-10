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
      const sessions = await prisma.billableSession.findMany({
        orderBy: {
          date: 'desc'
        }
      });
      return res.status(200).json(sessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await prisma.billableSession.create({
        data: {
          ...req.body,
          date: new Date(req.body.date || new Date()),
          startTime: new Date(req.body.startTime || new Date()),
          endTime: req.body.endTime ? new Date(req.body.endTime) : null
        }
      });
      return res.status(201).json(session);
    } catch (error) {
      console.error('Failed to create session:', error);
      return res.status(500).json({ error: 'Failed to create session' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 