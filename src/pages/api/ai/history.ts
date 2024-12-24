import { NextApiRequest, NextApiResponse } from 'next';
import MessageStorage from '@/utils/messageStorage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { threadId } = req.query;
      
      if (!threadId || typeof threadId !== 'string') {
        return res.status(400).json({ error: 'Thread ID is required' });
      }

      const messages = await MessageStorage.getMessages(threadId);
      return res.status(200).json({ messages });
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch chat history',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { threadId, message } = req.body;
      
      if (!threadId || !message) {
        return res.status(400).json({ error: 'Thread ID and message are required' });
      }

      await MessageStorage.storeMessage(threadId, message);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Failed to store message:', error);
      return res.status(500).json({ 
        error: 'Failed to store message',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 