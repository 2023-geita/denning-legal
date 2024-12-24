import fs from 'fs';
import path from 'path';

interface StoredMessage {
  text: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

class MessageStorage {
  private static getStorageDir() {
    const dir = path.join(process.cwd(), '.chat-history');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  private static getThreadFile(threadId: string) {
    return path.join(this.getStorageDir(), `${threadId}.json`);
  }

  static async storeMessage(threadId: string, message: StoredMessage) {
    try {
      const filePath = this.getThreadFile(threadId);
      let messages: StoredMessage[] = [];

      if (fs.existsSync(filePath)) {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        messages = JSON.parse(content);
      }

      messages.push(message);
      await fs.promises.writeFile(filePath, JSON.stringify(messages, null, 2));
    } catch (error) {
      console.error('Error storing message:', error);
    }
  }

  static async getMessages(threadId: string): Promise<StoredMessage[]> {
    try {
      const filePath = this.getThreadFile(threadId);
      if (!fs.existsSync(filePath)) {
        return [];
      }

      const content = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }
}

export default MessageStorage; 