import React, { useRef, useEffect } from 'react';
import Logo from '@/components/common/Logo';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  TypingIndicator: React.FC;
}

export const ChatMessage = ({ message, TypingIndicator }: ChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message.text]);

  return (
    <div 
      ref={messageRef}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.role === 'assistant' && (
        <div className="w-8 h-8 mr-3 flex-shrink-0">
          <Logo />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.role === 'user'
            ? 'bg-[#2D2D2D] text-white ml-auto'
            : 'bg-[#1A1A1A] text-white'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">
          {message.text || (message.isStreaming && <TypingIndicator />)}
        </p>
      </div>
    </div>
  );
}; 