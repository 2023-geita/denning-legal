import { useState } from 'react';
import { Message } from '@/types/chat';

export const useChatStream = (userEmail: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      isStreaming: true
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          message: messageText,
          threadId: currentThreadId
        }),
      });

      const data = await response.json();
      setCurrentThreadId(data.threadId);

      const eventSource = new EventSource(`/api/ai/chat?email=${encodeURIComponent(userEmail)}`);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages(prev => prev.map(msg => 
            msg.isStreaming ? { ...msg, text: data.text } : msg
          ));
        } catch (error) {
          console.error('Error parsing stream:', error);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsLoading(false);
        setMessages(prev => prev.map(msg => 
          msg.isStreaming ? { ...msg, isStreaming: false } : msg
        ));
      };

    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
}; 