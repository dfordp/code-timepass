// filepath: d:\Projects\Development\code-timepass\components\terminal.tsx
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TerminalProps {
  isVisible: boolean;
  onClose?: () => void;
  projectType?: 'weather' | 'portfolio' | 'api';
  isMinimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export function Terminal({ 
  isVisible,
  onClose,
  projectType = 'weather',
  isMinimized = false,
  onMinimize,
  onMaximize
}: TerminalProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate initial terminal output based on project type
  useEffect(() => {
    if (!isVisible) return;
    
    setHistory([
      `Welcome to Project Terminal - ${new Date().toLocaleString()}`,
      'Type "help" for available commands.'
    ]);
    
    // Focus the input when terminal becomes visible
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [isVisible]);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCommand.trim()) return;
    
    // Add command to history
    const newHistory = [...history, `$ ${currentCommand}`];
    
    // Process command and add response
    const response = processCommand(currentCommand, projectType);
    const updatedHistory = [...newHistory, ...response];
    
    setHistory(updatedHistory);
    setCurrentCommand('');
  };
  
  // Simulate a command execution with responses
  const processCommand = (command: string, projectType?: string): string[] => {
    const cmd = command.trim().toLowerCase();
    
    if (cmd === 'help') {
      return [
        'Available commands:',
        '  help          - Show this help message',
        '  clear         - Clear terminal history',
        '  ls            - List files in current directory',
        '  npm start     - Start the development server',
        '  npm run build - Build for production',
        '  exit          - Close terminal'
      ];
    }
    
    if (cmd === 'clear') {
      setTimeout(() => setHistory([]), 50);
      return [];
    }
    
    if (cmd === 'exit') {
      setTimeout(() => onClose && onClose(), 500);
      return ['Closing terminal...'];
    }
    
    if (cmd === 'ls') {
      if (projectType === 'weather') {
        return [
          'public/',
          'src/',
          'package.json',
          'README.md',
          'node_modules/',
          '.gitignore'
        ];
      } else if (projectType === 'portfolio') {
        return [
          'components/',
          'pages/',
          'styles/',
          'public/',
          'package.json',
          'next.config.js',
          'node_modules/',
          '.gitignore'
        ];
      } else {
        return [
          'controllers/',
          'models/',
          'routes/',
          'middleware/',
          'server.js',
          'package.json',
          'node_modules/',
          '.env',
          '.gitignore'
        ];
      }
    }
    
    if (cmd === 'npm start') {
      setIsTyping(true);
      
      const startupOutput = projectType === 'weather' || projectType === 'portfolio'
        ? [
            'Starting the development server...',
            '',
            'Compiled successfully!',
            '',
            'You can now view the app in the browser.',
            '',
            '  Local:            http://localhost:3000',
            '  On Your Network:  http://192.168.1.5:3000',
            '',
            'Note that the development build is not optimized.',
            'To create a production build, use npm run build.'
          ]
        : [
            'Starting the server...',
            '[nodemon] 2.0.22',
            '[nodemon] to restart at any time, enter `rs`',
            '[nodemon] watching path(s): *.*',
            '[nodemon] watching extensions: js,mjs,json',
            '[nodemon] starting `node server.js`',
            'Server running on port 5000',
            'MongoDB connected successfully'
          ];
      
      // Simulate typing effect for startup
      startupOutput.forEach((line, index) => {
        setTimeout(() => {
          setHistory(prev => [...prev, line]);
          if (index === startupOutput.length - 1) {
            setIsTyping(false);
          }
        }, 200 * (index + 1));
      });
      
      return [''];
    }
    
    if (cmd === 'npm run build') {
      setIsTyping(true);
      
      const buildOutput = [
        'Creating an optimized production build...',
        'Compiled successfully.',
        '',
        'File sizes after gzip:',
        '',
        '  126.4 KB  build/static/js/main.a1b2c3d4.js',
        '  23.8 KB   build/static/css/main.a1b2c3d4.css',
        '',
        'The project was built assuming it is hosted at /.',
        'You can control this with the homepage field in your package.json.',
        '',
        'The build folder is ready to be deployed.',
        'Find out more about deployment here:',
        '',
        '  https://create-react-app.dev/docs/deployment/'
      ];
      
      // Simulate typing effect for build
      buildOutput.forEach((line, index) => {
        setTimeout(() => {
          setHistory(prev => [...prev, line]);
          if (index === buildOutput.length - 1) {
            setIsTyping(false);
          }
        }, 150 * (index + 1));
      });
      
      return [''];
    }
    
    return [`Command not found: ${command}. Type "help" for available commands.`];
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (onMaximize && !isFullscreen) {
      onMaximize();
    }
  };

  if (!isVisible) return null;
  
  if (isMinimized) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="fixed bottom-4 right-4 z-50 rounded-md bg-theme-dark p-2 text-white shadow-lg"
        onClick={onMinimize}
      >
        Terminal
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed inset-x-4 bottom-4 z-50 overflow-hidden rounded-lg border border-theme-accent-1/30 bg-theme-dark shadow-xl",
        isFullscreen ? "inset-4 top-4" : "max-h-[50vh]"
      )}
      layout
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between border-b border-theme-accent-1/10 bg-theme-dark/80 p-2">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5 px-2">
            <div className="h-3 w-3 rounded-full bg-theme-accent-3"></div>
            <div className="h-3 w-3 rounded-full bg-theme-accent-1"></div>
            <div className="h-3 w-3 rounded-full bg-theme-accent-2"></div>
          </div>
          <div className="text-xs font-medium text-white/90">Terminal</div>
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMinimize}
            className="h-6 w-6 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen}
            className="h-6 w-6 text-white/70 hover:bg-white/10 hover:text-white"
          >
            {isFullscreen ? 
              <Minimize2 className="h-3.5 w-3.5" /> : 
              <Maximize2 className="h-3.5 w-3.5" />
            }
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-6 w-6 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="h-full max-h-[calc(50vh-40px)] overflow-auto p-3 font-mono text-xs text-white/90"
      >
        {history.map((line, idx) => (
          <div key={idx} className={cn(
            "mb-1 whitespace-pre-wrap",
            line.startsWith('$') ? "text-theme-accent-1" : ""
          )}>
            {line}
          </div>
        ))}
        
        {isTyping && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block h-4 w-2 bg-white/70"
          ></motion.span>
        )}
        
        <form onSubmit={handleCommandSubmit} className="mt-1 flex items-center">
          <span className="mr-2 text-theme-accent-1">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            autoFocus
            disabled={isTyping}
          />
        </form>
      </div>
    </motion.div>
  );
}