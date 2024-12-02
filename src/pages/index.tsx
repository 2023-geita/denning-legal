import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Logo from '@/components/common/Logo';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
    };

    // Simulate AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: "Hi! How may I assist you today?",
      isUser: false,
    };

    setMessages(prev => [...prev, newUserMessage, aiResponse]);
    setMessage('');
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
              <div className="mb-8">
                <Logo />
              </div>
              <h1 className="text-4xl font-heading font-bold text-white mb-8">
                How may I assist today?
              </h1>
              {/* Message Input centered below heading */}
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
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isUser && (
                    <div className="w-8 h-8 mr-3 flex-shrink-0">
                      <Logo />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.isUser
                        ? 'bg-[#2D2D2D] text-white ml-auto'
                        : 'bg-[#1A1A1A] text-white'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input for when there are messages */}
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