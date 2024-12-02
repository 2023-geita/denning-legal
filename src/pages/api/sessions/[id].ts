import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { sessionSchema } from '@/lib/validations/form';
import { Session } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string' || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid session ID' });
  }

  const db = await getDb();
  const collection = db.collection('sessions');
  const objectId = new ObjectId(id);

  if (req.method === 'GET') {
    try {
      const session = await collection.findOne({ _id: objectId });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.status(200).json(session);
    } catch (error) {
      console.error('Failed to fetch session:', error);
      res.status(500).json({ error: 'Failed to fetch session' });
    }
  }

  else if (req.method === 'PUT') {
    try {
      const updates = sessionSchema.partial().parse(req.body) as Partial<Session>;
      
      // If ending a session, calculate duration
      if (updates.endTime && !updates.duration) {
        const session = await collection.findOne({ _id: objectId });
        if (session) {
          const startTime = new Date(session.startTime);
          const endTime = new Date(updates.endTime);
          updates.duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000); // Duration in minutes
        }
      }

      const result = await collection.findOneAndUpdate(
        { _id: objectId },
        { 
          $set: {
            ...updates,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );

      if (!result?.value) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // If session is completed, create billing entry if billable
      if (updates.status === 'Completed' && result.value.billable) {
        const billingCollection = db.collection('billings');
        await billingCollection.insertOne({
          sessionId: id,
          matterId: result.value.matterId,
          amount: (result.value.duration / 60) * result.value.billingRate,
          status: 'Pending',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      res.status(200).json(result.value);
    } catch (error) {
      console.error('Failed to update session:', error);
      res.status(500).json({ error: 'Failed to update session' });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const result = await collection.deleteOne({ _id: objectId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.status(204).end();
    } catch (error) {
      console.error('Failed to delete session:', error);
      res.status(500).json({ error: 'Failed to delete session' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 