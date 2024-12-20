import type { NextApiRequest, NextApiResponse } from 'next';
import redisClient from '@/lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ping = await redisClient.ping();
    res.status(200).json({ redis: ping === 'PONG' ? 'healthy' : 'unhealthy' });
  } catch (error: unknown) {
    res.status(500).json({ redis: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}