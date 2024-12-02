import { NextApiRequest, NextApiResponse } from 'next';
import { Matter } from '@/types/matter';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    console.error('Invalid matter ID type:', typeof id);
    return res.status(400).json({ error: 'Invalid matter ID' });
  }

  try {
    // Validate ObjectId before attempting database connection
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      console.error('Invalid ObjectId format:', id, error);
      return res.status(400).json({ error: 'Invalid matter ID format' });
    }

    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    console.log('Connected to database successfully');

    const collection = db.collection('matters');
    console.log('Accessing matters collection');

    if (req.method === 'GET') {
      console.log('Processing GET request for matter:', id);
      const matter = await collection.findOne({ _id: objectId });

      if (!matter) {
        console.error('Matter not found:', id);
        return res.status(404).json({ error: 'Matter not found' });
      }

      // Format the response
      const formattedMatter = {
        id: matter._id.toString(),
        client: matter.client || '',
        status: matter.status || 'Open',
        notes: matter.notes || '',
        originatingAttorney: matter.originatingAttorney || '',
        responsibleAttorney: matter.responsibleAttorney || '',
        courtLocation: matter.courtLocation || '',
        practiceArea: matter.practiceArea || '',
        caseNumber: matter.caseNumber || '',
        createdAt: matter.createdAt || new Date(),
        updatedAt: matter.updatedAt || new Date()
      };

      console.log('Returning matter:', formattedMatter);
      return res.status(200).json(formattedMatter);
    }

    else if (req.method === 'PUT') {
      console.log('Processing PUT request for matter:', id);
      console.log('Request body:', JSON.stringify(req.body, null, 2));

      // Validate required fields
      if (!req.body) {
        console.error('No request body provided');
        return res.status(400).json({ error: 'No update data provided' });
      }

      // Prepare update data with validation
      const updates = {
        client: String(req.body.client || ''),
        status: ['Open', 'Pending', 'Closed'].includes(req.body.status) ? req.body.status : 'Open',
        notes: String(req.body.notes || ''),
        originatingAttorney: String(req.body.originatingAttorney || ''),
        responsibleAttorney: String(req.body.responsibleAttorney || ''),
        courtLocation: String(req.body.courtLocation || ''),
        practiceArea: String(req.body.practiceArea || ''),
        caseNumber: String(req.body.caseNumber || ''),
        updatedAt: new Date()
      };

      console.log('Validated updates:', JSON.stringify(updates, null, 2));

      // First check if the document exists
      const existingMatter = await collection.findOne({ _id: objectId });
      if (!existingMatter) {
        console.error('Matter not found:', id);
        return res.status(404).json({ error: 'Matter not found' });
      }

      console.log('Existing matter found:', existingMatter._id.toString());

      try {
        // Perform the update
        const result = await collection.findOneAndUpdate(
          { _id: objectId },
          { $set: updates },
          { 
            returnDocument: 'after'
          }
        );

        console.log('Update result:', JSON.stringify(result, null, 2));

        if (!result || !result.value) {
          console.error('Update failed - no document returned');
          return res.status(500).json({ error: 'Failed to update matter' });
        }

        // Format the response
        const updatedMatter = {
          id: result.value._id.toString(),
          ...updates,
          createdAt: result.value.createdAt || existingMatter.createdAt || new Date(),
        };

        console.log('Sending response:', JSON.stringify(updatedMatter, null, 2));
        return res.status(200).json(updatedMatter);
      } catch (updateError) {
        console.error('Error during update operation:', updateError);
        return res.status(500).json({ 
          error: 'Failed to update matter',
          details: updateError instanceof Error ? updateError.message : 'Unknown error during update'
        });
      }
    }

    // Handle other methods...
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 