import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Logo from '@/components/common/Logo';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  timestamp: string;
  isStreaming?: boolean;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState<string>('');
  const userEmail = session?.user?.email || guestEmail;
  const [isTyping, setIsTyping] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

  console.log(messages);
  
  useEffect(() => {
    if (!session?.user?.email) {
      setGuestEmail(`guest-${uuidv4()}@temp.com`);
    }
  }, [session, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setIsTyping(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
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
    setMessage('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          message: message,
          threadId: currentThreadId
        }),
      });

      const data = await response.json();
      if (data.threadId) {
        setCurrentThreadId(data.threadId);
      }

      const eventSource = new EventSource(`/api/ai/chat?email=${encodeURIComponent(userEmail)}`);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.text){
            setIsLoading(false);

          }
          
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'assistant' && lastMessage.isStreaming) {
              return prev.map((msg, index) => {
                if (index === prev.length - 1) {
                  return {
                    ...msg,
                    text: data.text,
                    isStreaming: true
                  };
                }
                return msg;
              });
            }
            return prev;
          });
        } catch (error) {
          console.error('Error parsing stream:', error);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsLoading(false);
        setIsTyping(false);
        setMessages(prev => 
          prev.map(msg => 
            msg.isStreaming ? { ...msg, isStreaming: false } : msg
          )
        );
      };

    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const TypingIndicator = () => (
    <div className="flex space-x-2 px-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  );

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-y-auto px-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
              <div className="mb-8">
                <Logo />
              </div>
              <h1 className="text-4xl font-heading font-bold text-white mb-8">
                How may I assist today?
              </h1>
              <div className="w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask Denning"
                    className="w-full bg-[#1A1A1A] text-white placeholder-gray-500 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A3B4]"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 py-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 mr-3 flex-shrink-0">
                      <Logo />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-[#2D2D2D] text-white ml-auto'
                        : 'bg-[#1A1A1A] text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {msg.text}
                      {msg.isStreaming && <TypingIndicator />}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {messages.length > 0 && (
          <div className="p-6 bg-black">
            <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Denning"
                className="w-full bg-[#1A1A1A] text-white placeholder-gray-500 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A3B4]"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
} 