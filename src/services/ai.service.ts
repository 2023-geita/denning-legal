import { Client } from "@langchain/langgraph-sdk";

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  role: 'user' | 'assistant';
}

export interface ThreadMetadata {
  thread_id: string;
  title: string;
  created_at: Date;
  last_message_at: Date;
}

interface StoredMessage {
  text: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export class AIService {
  private static client = new Client({
    apiUrl: process.env.LANGGRAPH_URL || 'http://localhost:8123',
    apiKey: process.env.LANGGRAPH_API_KEY,
  });

  private static async getDefaultAssistant() {
    try {
      const assistants = await this.client.assistants.search({
        metadata: null,
        offset: 0,
        limit: 1,
      });
      if (!assistants || assistants.length === 0) {
        throw new Error('No assistants found');
      }
      return assistants[0];
    } catch (error) {
      console.error('Error getting default assistant:', error);
      throw error;
    }
  }

  static async createThread() {
    try {
      return await this.client.threads.create();
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  }

  static async getThreadMessages(threadId: string) {
    try {
      const response = await fetch(`/api/ai/history?threadId=${threadId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      return data.messages.map((msg: StoredMessage): ChatMessage => ({
        id: `${Date.now()}-${msg.role}`,
        text: msg.text,
        role: msg.role,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Error getting thread messages:', error);
      throw error;
    }
  }

  static async* streamResponse(threadId: string, message: string) {
    try {
      console.log('Getting assistant...');
      const assistant = await this.getDefaultAssistant();
      if (!assistant) {
        throw new Error('No assistant available');
      }

      const messages = [{ role: "human", content: message }];
      console.log('Starting stream with message:', message);

      const streamResponse = await this.client.runs.stream(
        threadId,
        assistant.assistant_id,
        {
          input: { messages },
          streamMode: "messages"
        }
      );

      if (!streamResponse) {
        throw new Error('No stream response available');
      }

      console.log('Stream response initialized');
      for await (const chunk of streamResponse) {
        console.log('Received chunk:', chunk);
        if (chunk.event === "messages/partial") {
          if (!chunk.data?.[0]?.content) {
            console.warn('Received empty chunk content');
            continue;
          }

          const response = {
            id: Date.now().toString(),
            text: chunk.data[0].content,
            timestamp: new Date(),
            role: 'assistant'
          } as ChatMessage;

          console.log('Yielding response:', response);
          yield response;
        }
      }
      console.log('Stream complete');
    } catch (error) {
      console.error('Error in streamResponse:', error);
      throw error;
    }
  }

  static async listRuns(threadId: string) {
    try {
      return await this.client.runs.list(threadId);
    } catch (error) {
      console.error('Error listing runs:', error);
      throw error;
    }
  }
} 