import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { documentSchema } from '@/lib/validations/form';
import { getDocumentsCollection } from '@/lib/db';
import { ZodError } from 'zod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string' || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid document ID' });
  }

  const collection = await getDocumentsCollection();
  const objectId = new ObjectId(id);

  if (req.method === 'GET') {
    try {
      const document = await collection.findOne({ _id: objectId });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.status(200).json(document);
    } catch (error) {
      console.error('Failed to fetch document:', error);
      res.status(500).json({ error: 'Failed to fetch document' });
    }
  }

  else if (req.method === 'PUT') {
    try {
      const validatedData = documentSchema.partial().parse(req.body);
      
      const result = await collection.findOneAndUpdate(
        { _id: objectId },
        { 
          $set: {
            ...validatedData,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );

      if (!result?.value) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.status(200).json(result.value);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid document data', details: error.errors });
      } else {
        console.error('Failed to update document:', error);
        res.status(500).json({ error: 'Failed to update document' });
      }
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const result = await collection.deleteOne({ _id: objectId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.status(204).end();
    } catch (error) {
      console.error('Failed to delete document:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 