import { NextApiRequest, NextApiResponse } from 'next';
import { AIService } from '@/services/ai.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
      return res.status(400).json({ error: 'Thread ID and message are required' });
    }

    const assistant = await AIService.getDefaultAssistant();
    const response = await AIService.client.runs.create(threadId, assistant.assistant_id, {
      input: { 
        messages: [{ 
          role: "system", 
          content: "Generate a short, concise title (max 6 words) for this chat based on the first message." 
        }, {
          role: "human",
          content: message
        }]
      }
    });

    const title = response.output?.trim() || 'New Chat';
    return res.status(200).json({ title });
  } catch (error) {
    console.error('Error generating title:', error);
    return res.status(500).json({ error: 'Failed to generate title' });
  }
} 