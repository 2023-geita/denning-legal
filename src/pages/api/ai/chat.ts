import { NextApiRequest, NextApiResponse } from 'next';
import { AIService } from '@/services/ai.service';
import redisClient from '@/lib/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { message, email, threadId } = req.body;
      let currentThreadId = threadId;

      if (!currentThreadId) {
        const response = await AIService.createThread();
        currentThreadId = response.thread_id;
      }

      const pendingStream = JSON.stringify({
        threadId: currentThreadId,
        email,
        lastMessage: message,
        createdAt: new Date().toISOString()
      })
      
      // Store the new pending stream in Redis
      await redisClient.set(`chat:${email}`, pendingStream);

      return res.status(200).json(pendingStream);

    } catch (error) {
      console.error('AI Chat error:', error);
      return res.status(500).json({ error: 'Failed to process message' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { email } = req.query;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Get thread info from Redis
      const threadInfo = await redisClient.get(`chat:${email}`);

      if (!threadInfo) {
        return res.status(404).json({ error: 'No awaiting stream found for this user' });
      }

      const { threadId, lastMessage } = JSON.parse(threadInfo);

      // Set streaming headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      // Stream the response using the stored thread ID and last message
      for await (const chunk of AIService.streamResponse(threadId, lastMessage)) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      // Delete the thread info from Redis after streaming is complete
      await redisClient.del(`chat:${email}`);

      res.end();
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      return res.status(500).json({ error: 'Failed to fetch chat history' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 