import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Collection, Document, WithId } from 'mongodb';
import type { Client, ClientType } from '@/types/client';

interface ClientDocument extends WithId<Document> {
  name: string;
  type: ClientType;
  email: string;
  phone: string;
  location: string;
  responsibleAttorney: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Always set JSON content type
  res.setHeader('Content-Type', 'application/json');

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).json({ success: true });
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const collection: Collection<ClientDocument> = db.collection('clients');

    if (req.method === 'GET') {
      const clients = await collection.find().sort({ createdAt: -1 }).toArray();
      
      const formattedClients = clients.map(client => ({
        id: client._id.toString(),
        name: client.name,
        type: client.type,
        email: client.email,
        phone: client.phone,
        location: client.location,
        responsibleAttorney: client.responsibleAttorney,
        status: client.status,
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString()
      }));

      return res.status(200).json({
        success: true,
        data: formattedClients
      });
    }

    if (req.method === 'POST') {
      const { name, type, email, phone, location, responsibleAttorney, status } = req.body;

      // Validate required fields
      if (!name || !type || !email) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          error: 'Name, type, and email are required'
        });
      }

      const clientData = {
        name,
        type,
        email,
        phone: phone || '',
        location: location || '',
        responsibleAttorney: responsibleAttorney || '',
        status: status || 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ClientDocument;

      const result = await collection.insertOne(clientData);
      
      if (!result.acknowledged) {
        throw new Error('Failed to create client');
      }

      const createdClient = {
        id: result.insertedId.toString(),
        ...clientData,
        createdAt: clientData.createdAt.toISOString(),
        updatedAt: clientData.updatedAt.toISOString()
      };

      return res.status(201).json({
        success: true,
        data: createdClient
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 