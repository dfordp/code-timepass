"use client"

import { motion } from 'framer-motion';
import { CodePreview } from '@/components/code-preview';

interface CodeGenerationProps {
  isVisible: boolean;
  nodeId: string;
  code: string;
  title: string;
}

export function CodeGeneration({ isVisible, nodeId, code, title }: CodeGenerationProps) {
  if (!isVisible) return null;
  
  return (
    <motion.div
      className="overflow-hidden border-t border-theme-accent-1/10"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <CodePreview 
          code={code} 
          title={title} 
          language={code.includes('.jsx') ? 'jsx' : 'javascript'}
        />
      </div>
    </motion.div>
  );
}