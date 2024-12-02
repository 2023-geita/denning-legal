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

    const collection: Collection<MatterDocument> = db.collection('matters');
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
        // Format and validate the data
        const matterData = {
          client: String(req.body.client || ''),
          status: ['Open', 'Pending', 'Closed'].includes(req.body.status) ? req.body.status : 'Open',
          notes: String(req.body.notes || ''),
          originatingAttorney: String(req.body.originatingAttorney || ''),
          responsibleAttorney: String(req.body.responsibleAttorney || ''),
          courtLocation: String(req.body.courtLocation || ''),
          practiceArea: String(req.body.practiceArea || ''),
          caseNumber: String(req.body.caseNumber || ''),
          createdAt: new Date(),
          updatedAt: new Date()
        } as MatterDocument;

        console.log('Formatted matter data:', JSON.stringify(matterData, null, 2));

        console.log('Attempting to insert matter into database...');
        const result = await collection.insertOne(matterData);
        console.log('Insert result:', result);

        if (!result.acknowledged) {
          console.error('Insert not acknowledged by MongoDB');
          throw new Error('Failed to create matter - insert not acknowledged');
        }

        const createdMatter = {
          id: result.insertedId.toString(),
          ...matterData,
          createdAt: matterData.createdAt.toISOString(),
          updatedAt: matterData.updatedAt.toISOString()
        };

        console.log('Successfully created matter:', JSON.stringify(createdMatter, null, 2));
        return res.status(201).json({
          success: true,
          data: createdMatter
        });
      } catch (dbError) {
        console.error('Database operation error:', dbError);
        throw new Error(`Database operation failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
      }
    }

    if (req.method === 'GET') {
      console.log('Processing GET request');
      const matters = await collection.find().sort({ createdAt: -1 }).toArray();
      
      const formattedMatters = matters.map(matter => ({
        id: matter._id.toString(),
        client: matter.client || '',
        status: matter.status || 'Open',
        notes: matter.notes || '',
        originatingAttorney: matter.originatingAttorney || '',
        responsibleAttorney: matter.responsibleAttorney || '',
        courtLocation: matter.courtLocation || '',
        practiceArea: matter.practiceArea || '',
        caseNumber: matter.caseNumber || '',
        createdAt: matter.createdAt.toISOString(),
        updatedAt: matter.updatedAt.toISOString()
      }));

      console.log(`Found ${formattedMatters.length} matters`);
      return res.status(200).json({
        success: true,
        data: formattedMatters
      });
    }

    console.log('Method not allowed:', req.method);
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
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