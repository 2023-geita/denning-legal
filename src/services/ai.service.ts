import { Client } from "@langchain/langgraph-sdk";

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  role: 'user' | 'assistant';
}

export class AIService {
  private static client = new Client({
    apiUrl: process.env.LANGGRAPH_URL || 'http://localhost:8123',
    apiKey: process.env.LANGGRAPH_API_KEY,
  });

  private static async getDefaultAssistant() {
    const assistants = await this.client.assistants.search({
      metadata: null,
      offset: 0,
      limit: 1,
    });
    return assistants[0];
  }

  static async createThread() {
    try {
      return await this.client.threads.create();
    } catch (error) {
      console.error('Error creating thread:', error);
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

  static async* streamResponse(threadId: string, message: string) {
    try {
      const assistant = await this.getDefaultAssistant();
      const messages = [{ role: "human", content: message }];

      const streamResponse = this.client.runs.stream(
        threadId,
        assistant.assistant_id,
        {
          input: { messages },
          streamMode: "messages"
        }
      );

      for await (const chunk of streamResponse) {
        if (chunk.event === "messages/partial") {
          yield {
            id: Date.now().toString(),
            text: chunk.data[0].content,
            timestamp: new Date(),
            role: 'assistant'
          } as ChatMessage;
        }
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      throw error;
    }
  }

  // static async sendMessage(message: string): Promise<ChatMessage> {
  //   try {
  //     const thread = await this.createThread();
  //     const response = this.streamResponse(thread.thread_id, message);
      
  //     const firstResponse = await response.next();
  //     if (!firstResponse.value) {
  //       throw new Error('No response received from assistant');
  //     }
  //     return firstResponse.value;
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //     throw error;
  //   }
  // }
} 