import { NextApiRequest, NextApiResponse } from 'next';
import { AIService } from '@/services/ai.service';
import MessageStorage from '@/utils/messageStorage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { message, threadId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Create a new thread if not provided
    let thread;
    try {
      thread = threadId ? { thread_id: threadId } : await AIService.createThread();
    } catch (error) {
      console.error('Thread creation error:', error);
      return res.status(500).json({ error: 'Failed to create chat thread' });
    }

    // Set thread ID in response header for new threads
    if (!threadId) {
      res.setHeader('x-thread-id', thread.thread_id);
    }

    // Store user message
    await MessageStorage.storeMessage(thread.thread_id, {
      text: message,
      role: 'user',
      timestamp: new Date().toISOString()
    });

    try {
      // Stream the response
      let assistantMessage = '';
      console.log('Starting stream response...');

      // Create a write promise to ensure messages are sent in order
      const writeChunk = async (chunk: any) => {
        return new Promise<void>((resolve, reject) => {
          const ok = res.write(
            `data: ${JSON.stringify(chunk)}\n\n`,
            'utf-8',
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
          if (ok) resolve();
        });
      };

      for await (const chunk of AIService.streamResponse(thread.thread_id, message)) {
        console.log('Received chunk:', chunk);
        assistantMessage = chunk.text;
        await writeChunk(chunk);
      }

      console.log('Stream complete. Final message:', assistantMessage);

      // Store assistant message after streaming is complete
      if (assistantMessage) {
        await MessageStorage.storeMessage(thread.thread_id, {
          text: assistantMessage,
          role: 'assistant',
          timestamp: new Date().toISOString()
        });
      }

      // End the response
      res.end();
    } catch (error) {
      console.error('Streaming error:', error);
      const errorMessage = {
        id: Date.now().toString(),
        text: 'An error occurred while processing your message',
        timestamp: new Date(),
        role: 'assistant'
      };

      await writeChunk(errorMessage);
      
      // Store error message
      await MessageStorage.storeMessage(thread.thread_id, {
        text: errorMessage.text,
        role: 'assistant',
        timestamp: new Date().toISOString()
      });

      res.end();
    }
  } catch (error) {
    console.error('AI Chat error:', error);
    return res.status(500).json({ 
      error: 'Failed to process message', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 