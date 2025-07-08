"use client"

import { useEffect, useRef, useState } from 'react';
import { Send, Paperclip, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type LangChainMessage = {
  id: string;
  type: 'human' | 'ai';
  content: string;
};

interface ChatInterfaceProps {
  messages: LangChainMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

export function ChatInterface({ messages, isLoading, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Suggestion prompts to help users get started
  const suggestionPrompts = [
  "Create a React app that fetches and displays weather data",
  "Build a Node.js API with authentication and MongoDB",
  "Design a portfolio website with Next.js and Tailwind"
];
  // Auto-increment progress when in loading state
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isLoading) {
      setProcessingProgress(0);
      progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 10;
        });
      }, 300);
    } else {
      setProcessingProgress(100);
    }

    return () => clearInterval(progressInterval);
  }, [isLoading]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  // Format code blocks in messages
  const formatMessageContent = (content: string) => {
    // Simple code block detection (improve this for production)
    if (content.includes('```')) {
      return (
        <div>
          {content.split('```').map((part, index) => {
            if (index % 2 === 0) {
              return <p key={index}>{part}</p>;
            } else {
              return (
                <pre key={index} className="my-2 overflow-x-auto rounded-md bg-theme-dark/5 p-3 text-sm font-mono">
                  <code>{part}</code>
                </pre>
              );
            }
          })}
        </div>
      );
    }
    return content;
  };

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 && !isLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <div className="mb-6 rounded-full bg-theme-accent-1/10 p-3">
            <RefreshCw className="h-6 w-6 text-theme-accent-1" />
          </div>
          <h3 className="mb-2 text-center text-lg font-medium text-theme-dark">Start a conversation</h3>
          <p className="mb-8 text-center text-sm text-theme-dark/60">
            Describe what you want to build, and I'll create a workflow for you
          </p>
          
          <div className="grid w-full max-w-md gap-2">
            {suggestionPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start border-theme-accent-1/20 bg-theme-light/50 text-left text-sm font-normal text-theme-dark/80 hover:bg-theme-accent-1/10"
                onClick={() => onSendMessage(prompt)}
              >
                "{prompt}"
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'mb-4 flex',
                  message.type === 'human' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-lg px-4 py-3',
                    message.type === 'human'
                      ? 'bg-theme-accent-1/90 text-theme-dark'
                      : 'bg-theme-light/80 border border-theme-accent-2/30 text-theme-dark'
                  )}
                >
                  {formatMessageContent(message.content)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex justify-start"
            >
              <div className="max-w-[85%] rounded-lg border border-theme-accent-2/30 bg-theme-light/80 px-4 py-3 text-theme-dark">
                <div className="flex items-center space-x-2">
                  <div className="typing-dot animation-delay-0 h-3 w-3 animate-pulse rounded-full bg-theme-accent-1"></div>
                  <div className="typing-dot animation-delay-150 h-3 w-3 animate-pulse rounded-full bg-theme-accent-1"></div>
                  <div className="typing-dot animation-delay-300 h-3 w-3 animate-pulse rounded-full bg-theme-accent-1"></div>
                </div>
                <div className="mt-2">
                  <Progress value={processingProgress} className="h-1 w-full bg-theme-neutral/20" />
                  <div className="mt-1 text-xs text-theme-dark/70">
                    {processingProgress < 30 ? "Analyzing your request..." : 
                     processingProgress < 60 ? "Generating workflow..." : 
                     processingProgress < 95 ? "Finalizing response..." : "Done!"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="border-t border-theme-accent-1/10 bg-white/50 p-4">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="flex-shrink-0 rounded-full text-theme-dark/50 hover:bg-theme-accent-1/10 hover:text-theme-dark/70"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="rounded-full border-theme-accent-1/30 bg-theme-light/50 pl-4 pr-10 text-theme-dark placeholder:text-theme-dark/40"
              disabled={isLoading}
            />
            <Button 
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full text-theme-dark/50 hover:bg-theme-accent-1/10 hover:text-theme-dark/70"
            >
            </Button>
          </div>
          
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 rounded-full bg-theme-accent-1 text-theme-dark hover:bg-theme-accent-2"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}