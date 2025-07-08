import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { GitBranchPlusIcon } from 'lucide-react';

interface ThinkingIndicatorProps {
  isThinking: boolean;
  text?: string;
}

export function ThinkingIndicator({ isThinking, text = "Thinking..." }: ThinkingIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState("Analyzing your request...");
  
  useEffect(() => {
    if (!isThinking) {
      setProgress(0);
      return;
    }
    
    const interval = setInterval(() => {
      setProgress(prev => {
        // Update thinking phase text based on progress
        if (prev < 30 && prev + 3 >= 30) {
          setPhaseText("Planning solution architecture...");
        } else if (prev < 60 && prev + 3 >= 60) {
          setPhaseText("Generating code components...");
        } else if (prev < 85 && prev + 3 >= 85) {
          setPhaseText("Finalizing implementation...");
        }
        
        if (prev >= 95) {
          clearInterval(interval);
          return 95; // Cap at 95% until complete
        }
        return prev + Math.random() * 3; // Random progress to feel more natural
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, [isThinking]);
  
  if (!isThinking) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center space-y-4 p-8"
    >
      <motion.div 
        className="flex h-16 w-16 items-center justify-center rounded-full bg-theme-accent-1/20"
        animate={{ 
          scale: [1, 1.1, 1],
          backgroundColor: ["rgba(218, 246, 130, 0.2)", "rgba(218, 246, 130, 0.3)", "rgba(218, 246, 130, 0.2)"]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <GitBranchPlusIcon className="h-8 w-8 text-theme-accent-3" />
      </motion.div>
      
      <motion.div 
        className="text-center font-medium text-theme-dark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {text}
      </motion.div>
      
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Progress value={progress} className="h-1.5 w-full bg-theme-neutral/20" />
        <p className="mt-2 text-center text-sm text-theme-dark/70">{phaseText}</p>
      </motion.div>
    </motion.div>
  );
}