import { ThreadMetadata } from '@/services/ai.service';

export const ThreadStorage = {
  getThreads(): ThreadMetadata[] {
    if (typeof window === 'undefined') return [];
    try {
      const threadsJson = localStorage.getItem('chatThreads');
      return threadsJson ? JSON.parse(threadsJson) : [];
    } catch (error) {
      console.error('Error getting stored threads:', error);
      return [];
    }
  },

  addThread(thread: ThreadMetadata) {
    if (typeof window === 'undefined') return;
    try {
      const threads = this.getThreads();
      threads.push(thread);
      localStorage.setItem('chatThreads', JSON.stringify(threads));
    } catch (error) {
      console.error('Error adding thread:', error);
    }
  },

  updateThread(threadId: string, updates: Partial<ThreadMetadata>) {
    if (typeof window === 'undefined') return;
    try {
      const threads = this.getThreads();
      const threadIndex = threads.findIndex(t => t.thread_id === threadId);
      
      if (threadIndex !== -1) {
        threads[threadIndex] = { ...threads[threadIndex], ...updates };
        localStorage.setItem('chatThreads', JSON.stringify(threads));
      }
    } catch (error) {
      console.error('Error updating thread:', error);
    }
  },

  async generateTitle(threadId: string, firstMessage: string): Promise<string> {
    try {
      const response = await fetch('/api/ai/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, message: firstMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate title');
      }

      const { title } = await response.json();
      this.updateThread(threadId, { title });
      return title;
    } catch (error) {
      console.error('Error generating title:', error);
      return 'New Chat';
    }
  }
}; 