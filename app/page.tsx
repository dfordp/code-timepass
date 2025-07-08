"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ButterflowWorkflowVisualization } from '@/components/workflow-visualization';
import { Workflow } from '@/components/types';

type LangChainMessage = {
  id: string;
  type: 'human' | 'ai';
  content: string;
};

const ChatInterface = ({
  messages,
  isLoading,
  onSendMessage,
}: {
  messages: LangChainMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

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

  return (
    <div className="flex h-full flex-col">
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
                  'max-w-[80%] rounded-lg px-4 py-2',
                  message.type === 'human'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {message.content}
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
            <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-pulse rounded-full bg-primary/50"></div>
                <div className="h-4 w-4 animate-pulse rounded-full bg-primary/50" style={{ animationDelay: "0.2s" }}></div>
                <div className="h-4 w-4 animate-pulse rounded-full bg-primary/50" style={{ animationDelay: "0.4s" }}></div>
              </div>
              <div className="mt-2">
                <Progress value={processingProgress} className="h-1 w-full" />
                <div className="mt-1 text-xs">
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
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default function IndexPage() {
  const [messages, setMessages] = useState<LangChainMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [showMobileView, setShowMobileView] = useState<'chat' | 'workflow'>('chat');
  const [landingMode, setLandingMode] = useState(true); // New state for landing mode
  const _threadId = useRef(uuid());
  
  const hasWorkflow = workflow !== null;

  const handleSendMessage = async (content: string) => {
    // Exit landing mode when first message is sent
    if (landingMode) {
      setLandingMode(false);
    }
    
    // Set chat as started
    if (!chatStarted) {
      setChatStarted(true);
    }

    // Add user message to chat
    const userMessage: LangChainMessage = {
      id: uuid(),
      type: 'human',
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // In a real implementation, this would call the streamWorkflow function
      // For now, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate AI response
      const aiMessage: LangChainMessage = {
        id: uuid(),
        type: 'ai',
        content:
          "I've created a workflow based on your request. You can see it visualized on the right.",
      };

      // Simulate workflow data (in real implementation, this would come from the streamWorkflow function)
      const mockWorkflow: Workflow = {
        version: '1.0',
        nodes: [
          {
            id: 'start',
            name: 'Start Node',
            type: 'automatic',
            steps: [],
          },
          {
            id: 'process',
            name: 'Process Data',
            type: 'automatic',
            depends_on: ['start'],
            steps: [],
          },
          {
            id: 'decision',
            name: 'Make Decision',
            type: 'manual',
            depends_on: ['process'],
            steps: [],
          },
          {
            id: 'success',
            name: 'Success Path',
            type: 'automatic',
            depends_on: ['decision'],
            steps: [],
          },
          {
            id: 'failure',
            name: 'Failure Path',
            type: 'automatic',
            depends_on: ['decision'],
            steps: [],
          },
          {
            id: 'end',
            name: 'End Node',
            type: 'automatic',
            depends_on: ['success', 'failure'],
            steps: [],
          },
        ],
      };

      setMessages((prev) => [...prev, aiMessage]);
      setWorkflow(mockWorkflow);
    } catch (error) {
      console.error('Error in chat:', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  // If in landing mode, show the clean landing page
  if (landingMode) {
    return (
      <motion.div 
        className="flex h-[calc(100vh-70px)] w-full flex-col items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-full max-w-xl rounded-xl border p-8 shadow-lg"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h1 
            className="mb-6 text-center text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Build with AI
          </motion.h1>
          
          <motion.p
            className="mb-8 text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Describe what you want to build, and I'll create a workflow for you
          </motion.p>
          
          <motion.form 
            onSubmit={(e) => {
              e.preventDefault();
              const inputEl = e.currentTarget.querySelector('textarea') as HTMLTextAreaElement;
              if (inputEl.value.trim()) {
                handleSendMessage(inputEl.value);
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Textarea 
              placeholder="e.g., 'Create a React app that fetches and displays weather data'"
              className="mb-4 h-32 resize-none"
            />
            <Button type="submit" className="w-full">
              Generate Workflow
            </Button>
          </motion.form>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="h-[calc(100vh-70px)] w-full px-4 py-2 md:px-8">
      {/* Mobile Toggle - Only on mobile */}
      <div className="mb-2 flex md:hidden">
        <Button
          variant={showMobileView === 'chat' ? 'default' : 'outline'}
          onClick={() => setShowMobileView('chat')}
          className="flex-1 rounded-none"
        >
          Chat
        </Button>
        <Button
          variant={showMobileView === 'workflow' ? 'default' : 'outline'}
          onClick={() => setShowMobileView('workflow')}
          className="flex-1 rounded-none"
          disabled={!hasWorkflow}
        >
          Workflow
          {hasWorkflow && <Badge className="ml-2">1</Badge>}
        </Button>
      </div>

      {/* Main two-pane layout container */}
      <div className="relative flex h-[calc(100%-40px)] w-full md:h-full">
        {/* Left pane - Chat */}
        <motion.div
          className={cn(
            'flex h-full overflow-hidden',
            showMobileView === 'workflow' ? 'hidden md:flex' : 'flex'
          )}
          initial={{ width: '100%' }}
          animate={{ 
            width: hasWorkflow ? '40%' : 'min(100%, 800px)',
            x: hasWorkflow ? 0 : 'calc(50% - min(50%, 400px))',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Card className="flex h-full w-full flex-col overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Right pane - Workflow visualization */}
        <AnimatePresence>
          {hasWorkflow && (
            <motion.div
              className={cn(
                'flex h-full overflow-hidden',
                showMobileView === 'chat' ? 'hidden md:flex' : 'flex'
              )}
              initial={{ width: 0, opacity: 0, x: '5%' }}
              animate={{ width: '60%', opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: '5%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Card className="flex h-full w-full flex-col overflow-hidden">
                <CardHeader className="pb-0">
                  <CardTitle>Workflow Diagram</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 pt-2">
                  {workflow && (
                    <ButterflowWorkflowVisualization
                      workflow={{ workflow }}
                      tasks={[]}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}