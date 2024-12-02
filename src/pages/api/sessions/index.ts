import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';
import { sessionSchema } from '@/lib/validations/form';
import { Session } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDb();
  const collection = db.collection('sessions');

  if (req.method === 'GET') {
    try {
      const { matterId, startDate, endDate } = req.query;
      const query: any = {};

      if (matterId) {
        query.matterId = matterId;
      }

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string)
        };
      }

      const sessions = await collection
        .find(query)
        .sort({ date: -1 })
        .toArray();

      const stats = await collection.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalHours: { $sum: { $divide: ['$duration', 60] } },
            billableHours: {
              $sum: {
                $cond: [
                  '$billable',
                  { $divide: ['$duration', 60] },
                  0
                ]
              }
            },
            totalSessions: { $sum: 1 },
            averageSessionDuration: { $avg: '$duration' }
          }
        }
      ]).toArray();

      res.status(200).json({
        sessions,
        stats: stats[0] || {
          totalHours: 0,
          billableHours: 0,
          totalSessions: 0,
          averageSessionDuration: 0
        }
      });
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  }

  else if (req.method === 'POST') {
    try {
      const validatedData = sessionSchema.parse(req.body);
      
      const session = await collection.insertOne({
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      res.status(201).json({
        _id: session.insertedId,
        ...validatedData
      });
    } catch (error) {
      console.error('Failed to create session:', error);
      res.status(500).json({ error: 'Failed to create session' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 