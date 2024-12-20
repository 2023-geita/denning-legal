import { NextApiRequest, NextApiResponse } from 'next';
import redisClient from '@/lib/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test setting a value
    await redisClient.set('test-key', 'Hello Redis!');
    
    // Test getting the value
    const value = await redisClient.get('test-key');
    
    res.status(200).json({ value });
  } catch (error) {
    console.error('Redis test error:', error);
    res.status(500).json({ error: 'Redis test failed' });
  }
} 