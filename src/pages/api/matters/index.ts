import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Collection, Document, WithId } from 'mongodb';
import type { Matter } from '@/types/matter';

interface MatterDocument extends WithId<Document> {
  client: string;
  status: 'Open' | 'Pending' | 'Closed';
  notes: string;
  originatingAttorney: string;
  responsibleAttorney: string;
  courtLocation: string;
  practiceArea: string;
  caseNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API Route: /api/matters');
  console.log('Method:', req.method);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('Attempting database connection...');
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    console.log('Database connected successfully');

    const mattersCollection = db.collection<MatterDocument>('matters');
    console.log('Accessing matters collection');

    if (req.method === 'POST') {
      console.log('Processing POST request');
      console.log('Request body:', JSON.stringify(req.body, null, 2));

      // Validate required fields
      if (!req.body) {
        console.error('No request body provided');
        return res.status(400).json({
          success: false,
          message: 'No data provided'
        });
      }

      try {
        const matterData = req.body;
        const result = await mattersCollection.insertOne({
          ...matterData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        res.status(201).json({ message: 'Matter created', id: result.insertedId });
      } catch (dbError) {
        console.error('Database operation error:', dbError);
        throw new Error(`Database operation failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
      }
    } else if (req.method === 'GET') {
      console.log('Processing GET request');
      const matters = await mattersCollection.find().toArray();
      res.status(200).json(matters);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}