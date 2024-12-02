import { NextApiRequest, NextApiResponse } from 'next';
import { documentSchema } from '@/lib/validations/form';
import { getDocumentsCollection, handleDbError } from '@/lib/db';
import { ZodError } from 'zod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const collection = await getDocumentsCollection();
      const documents = await collection.find().sort({ createdAt: -1 }).toArray();
      res.status(200).json(documents);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const validatedData = documentSchema.parse(req.body);
      const collection = await getDocumentsCollection();
      
      const document = await collection.insertOne({
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      res.status(201).json({ 
        _id: document.insertedId,
        ...validatedData
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid document data', details: error.errors });
      } else {
        console.error('Failed to create document:', error);
        res.status(500).json({ error: 'Failed to create document' });
      }
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 