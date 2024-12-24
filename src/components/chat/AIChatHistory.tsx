import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { AIService, ThreadMetadata } from '@/services/ai.service';
import ChatHistoryCards from './ChatHistoryCards';
import { ThreadStorage } from '@/utils/threadStorage';

interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  threadId?: string;
  timestamp?: Date;
}

// Add this custom style object for markdown formatting
const markdownStyles = {
  p: 'mb-4 last:mb-0',
  h1: 'text-2xl font-bold mb-4',
  h2: 'text-xl font-bold mb-3',
  h3: 'text-lg font-bold mb-3',
  ul: 'list-disc pl-4 mb-4',
  ol: 'list-decimal pl-4 mb-4',
  li: 'mb-1',
  blockquote: 'border-l-4 border-gray-300 pl-4 italic my-4',
  code: 'bg-[#1A1A1A] rounded px-1.5 py-0.5 font-mono text-sm',
  pre: 'bg-[#1A1A1A] rounded-lg p-3 mb-4 overflow-x-auto',
  a: 'text-blue-400 hover:underline',
  strong: 'font-bold',
  em: 'italic',
  table: 'min-w-full border-collapse mb-4',
  th: 'border border-[#2D2D2D] px-4 py-2 bg-[#1A1A1A]',
  td: 'border border-[#2D2D2D] px-4 py-2',
};

// Create a separate input component
const ChatInput = ({ input, setInput, isLoading, handleSubmit }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="p-2 sm:p-4 mb-4">
      <div className="relative max-w-chat mx-auto space-y-2">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isFocused ? '' : 'Ask Denning'}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-[#2D2D2D] rounded-lg pl-3 sm:pl-4 pr-10 sm:pr-12 py-4 sm:py-6 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-0 placeholder-top transition-colors"
            style={{ paddingTop: '1.5rem' }}
            disabled={isLoading}
          />
          
          {/* Attach File Button */}
          <button
            type="button"
            className="absolute left-3 bottom-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => {/* Handle file attachment */}}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"/>
            </svg>
          </button>
        </form>
        
        {/* Disclaimer Text */}
        <p className="text-center text-xs text-gray-500">
          Denning can make mistakes, a reminder that you are the wakili!!
        </p>
      </div>
    </div>
  );
};

export default function AIChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ThreadMetadata[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Load threads on mount
  useEffect(() => {
    const storedThreads = ThreadStorage.getThreads();
    setThreads(storedThreads);
    
    const lastThreadId = localStorage.getItem('currentThreadId');
    if (lastThreadId) {
      setCurrentThreadId(lastThreadId);
      loadThreadMessages(lastThreadId);
    }
  }, []);

  // Add effect to scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadThreadMessages = async (threadId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/ai/history?threadId=${threadId}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.messages)) {
          // Sort messages by timestamp if available
          const sortedMessages = data.messages.sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeA - timeB;
          });
          setMessages(sortedMessages);
          setShowHistory(false); // Hide history after loading messages
        } else {
          console.error('Invalid messages format:', data);
          setMessages([]);
        }
      } else {
        console.error('Failed to load messages:', await response.text());
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading thread messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentThreadId(null);
    setMessages([]);
    setShowHistory(false);
    localStorage.removeItem('currentThreadId');
  };

  const handleSelectThread = async (threadId: string) => {
    setCurrentThreadId(threadId);
    localStorage.setItem('currentThreadId', threadId);
    await loadThreadMessages(threadId);
  };

  const handleBackToHistory = () => {
    setShowHistory(true);
    // Refresh threads list
    const storedThreads = ThreadStorage.getThreads();
    setThreads(storedThreads);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      role: 'user',
      threadId: currentThreadId
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
        body: JSON.stringify({ 
          message: userMessage.text,
          threadId: currentThreadId
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
      }

      // Extract thread ID from response headers if it's a new thread
      const threadId = response.headers.get('x-thread-id');
      if (threadId && !currentThreadId) {
        setCurrentThreadId(threadId);
        localStorage.setItem('currentThreadId', threadId);
        
        // Generate and save thread title
        const title = await ThreadStorage.generateTitle(threadId, userMessage.text);
        const newThread: ThreadMetadata = {
          thread_id: threadId,
          title,
          created_at: new Date(),
          last_message_at: new Date()
        };
        ThreadStorage.addThread(newThread);
        setThreads(prev => [...prev, newThread]);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        role: 'assistant',
        threadId: threadId || currentThreadId
      };
      setMessages(prev => [...prev, assistantMessage]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          console.log('Received chunk:', chunk);

          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          console.log('Parsed lines:', lines);

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                console.log('Parsed data:', data);
                
                setMessages(prev => {
                  const newMessages = prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, text: data.text }
                      : msg
                  );
                  console.log('Updated messages:', newMessages);
                  return newMessages;
                });
              } catch (e) {
                console.error('Error parsing SSE data:', e, 'Line:', line);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error reading stream:', error);
        throw error;
      } finally {
        reader.releaseLock();
      }

      // Update thread metadata
      if (threadId || currentThreadId) {
        ThreadStorage.updateThread(threadId || currentThreadId, {
          last_message_at: new Date()
        });
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: error instanceof Error ? error.message : 'Sorry, there was an error processing your message.',
        role: 'assistant',
        threadId: currentThreadId
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // If showing history
  if (showHistory) {
    return (
      <ChatHistoryCards
        threads={threads}
        currentThreadId={currentThreadId}
        onSelectThread={handleSelectThread}
        onNewChat={handleNewChat}
      />
    );
  }

  // Chat view
  return (
    <div className="h-full flex flex-col">
      {/* Header with back button */}
      <div className="p-4 border-b border-[#2D2D2D] flex items-center">
        <button
          onClick={handleBackToHistory}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="ml-4 text-lg font-medium">
          {currentThreadId 
            ? threads.find(t => t.thread_id === currentThreadId)?.title || 'Chat'
            : 'New Chat'
          }
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 sm:space-y-6 pr-6 sm:pr-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2D2D2D] hover:scrollbar-thumb-[#3D3D3D]">
        {messages.map((message, index) => {
          const messageKey = `${message.id}-${message.role}-${index}`;
          return (
            <div
              key={messageKey}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 sm:w-12 h-8 sm:h-12 rounded-full bg-black flex items-center justify-center mr-2 sm:mr-3 overflow-hidden border border-[#2D2D2D]">
                  <img 
                    src="/images/image-removebg-preview (1).png"
                    alt="Assistant Logo"
                    className="w-4 sm:w-6 h-4 sm:h-6 object-cover rounded-full"
                  />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 group ${
                  message.role === 'user'
                    ? 'bg-[#2D2D2D] text-white'
                    : 'text-white'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>
                ) : (
                  <ReactMarkdown
                    key={`markdown-${messageKey}`}
                    className="text-sm sm:text-base"
                    components={{
                      p: ({node, children, ...props}) => <p key={`p-${props.key || messageKey}`} className={markdownStyles.p} {...props}>{children}</p>,
                      h1: ({node, children, ...props}) => <h1 key={`h1-${props.key || messageKey}`} className={markdownStyles.h1} {...props}>{children}</h1>,
                      h2: ({node, children, ...props}) => <h2 key={`h2-${props.key || messageKey}`} className={markdownStyles.h2} {...props}>{children}</h2>,
                      h3: ({node, children, ...props}) => <h3 key={`h3-${props.key || messageKey}`} className={markdownStyles.h3} {...props}>{children}</h3>,
                      ul: ({node, children, ...props}) => <ul key={`ul-${props.key || messageKey}`} className={markdownStyles.ul} {...props}>{children}</ul>,
                      ol: ({node, children, ...props}) => <ol key={`ol-${props.key || messageKey}`} className={markdownStyles.ol} {...props}>{children}</ol>,
                      li: ({node, children, ...props}) => <li key={`li-${props.key || messageKey}`} className={markdownStyles.li} {...props}>{children}</li>,
                      blockquote: ({node, children, ...props}) => <blockquote key={`blockquote-${props.key || messageKey}`} className={markdownStyles.blockquote} {...props}>{children}</blockquote>,
                      code: ({node, inline, children, ...props}) => 
                        inline ? (
                          <code key={`code-inline-${props.key || messageKey}`} className={markdownStyles.code} {...props}>{children}</code>
                        ) : (
                          <pre key={`pre-${props.key || messageKey}`} className={markdownStyles.pre}>
                            <code key={`code-block-${props.key || messageKey}`} {...props}>{children}</code>
                          </pre>
                        ),
                      a: ({node, children, ...props}) => <a key={`a-${props.key || messageKey}`} className={markdownStyles.a} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
                      strong: ({node, children, ...props}) => <strong key={`strong-${props.key || messageKey}`} className={markdownStyles.strong} {...props}>{children}</strong>,
                      em: ({node, children, ...props}) => <em key={`em-${props.key || messageKey}`} className={markdownStyles.em} {...props}>{children}</em>,
                      table: ({node, children, ...props}) => <table key={`table-${props.key || messageKey}`} className={markdownStyles.table} {...props}>{children}</table>,
                      th: ({node, children, ...props}) => <th key={`th-${props.key || messageKey}`} className={markdownStyles.th} {...props}>{children}</th>,
                      td: ({node, children, ...props}) => <td key={`td-${props.key || messageKey}`} className={markdownStyles.td} {...props}>{children}</td>,
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                )}
                {message.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(message.text, message.id)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs sm:text-sm flex items-center gap-2
                      ${copiedMessageId === message.id ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    {copiedMessageId === message.id ? (
                      <>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput 
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
} 