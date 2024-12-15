import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { AIService } from '@/services/ai.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === 'POST') {
    try {
      const { message, threadId } = req.body;
      
      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      res.flushHeaders();


      // Create a new thread if not provided
      const thread = threadId ? { thread_id: threadId } : await AIService.createThread();
      
      // console.log("***** Begin Streaming ******")
      // Stream the response
      for await (const chunk of AIService.streamResponse(thread.thread_id, message)) {
        // console.log(chunk)
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }

      res.end();
    } catch (error) {
      console.error('AI Chat error:', error);
      return res.status(500).json({ error: 'Failed to process message' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { threadId } = req.query;
      
      if (!threadId || typeof threadId !== 'string') {
        return res.status(400).json({ error: 'Thread ID is required' });
      }

      const runs = await AIService.listRuns(threadId);
      return res.status(200).json({ runs });
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      return res.status(500).json({ error: 'Failed to fetch chat history' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 