"use client"

import { ArrowRight, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface LandingPageProps {
  onSubmit: (content: string) => void;
}

export function LandingPage({ onSubmit }: LandingPageProps) {
  const [inputValue, setInputValue] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue);
    }
  };

  // Example projects that could inspire users
  const examples = [
    "Create a React app that fetches and displays weather data",
    "Build a Node.js API with authentication and MongoDB",
    "Design a portfolio website with Next.js and Tailwind"
  ];
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-[calc(100vh-70px)] w-full overflow-hidden bg-gradient-to-b from-theme-light to-white">
      {/* Background decorative elements */}
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-theme-accent-1/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-theme-accent-2/10 blur-3xl"></div>
      
      <motion.div 
        className="flex min-h-[calc(100vh-70px)] w-full flex-col items-center justify-center px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="w-full max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Heading */}
          <motion.h1 
            className="mb-4 text-center text-4xl font-bold leading-tight text-theme-dark md:text-5xl"
            variants={itemVariants}
          >
            Transform Ideas into <span className="bg-gradient-to-r from-theme-accent-3 to-theme-accent-1 bg-clip-text text-transparent">Workflows</span>
          </motion.h1>
          
          {/* Subheading */}
          <motion.p
            className="mb-10 text-center text-lg text-theme-dark/70 md:text-xl"
            variants={itemVariants}
          >
            Describe what you want to build, and our AI will create a comprehensive workflow
          </motion.p>
          
          {/* Card */}
          <motion.div
            className="mb-8 overflow-hidden rounded-xl border border-theme-accent-1/30 bg-white/90 shadow-xl backdrop-blur-sm"
            variants={itemVariants}
          >
            {/* Card header */}
            <div className="border-b border-theme-accent-1/10 bg-theme-light/50 px-6 py-4">
              <div className="flex items-center">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-theme-accent-3"></div>
                  <div className="h-3 w-3 rounded-full bg-theme-accent-1"></div>
                  <div className="h-3 w-3 rounded-full bg-theme-accent-2"></div>
                </div>
                <div className="ml-4 text-sm font-medium text-theme-dark/70">New Project</div>
              </div>
            </div>
            
            {/* Card body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-theme-dark/70" htmlFor="project-description">
                    Project Description
                  </label>
                  <Textarea 
                    id="project-description"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Describe your project idea in detail..."
                    className="min-h-[150px] resize-none border-theme-accent-1/30 bg-theme-light/30 text-theme-dark placeholder:text-theme-dark/40 focus-visible:ring-theme-accent-1"
                  />
                </div>
                
                {/* Examples section */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-theme-dark/60">
                    EXAMPLES
                  </p>
                  <div className="grid gap-2">
                    {examples.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        className="flex items-center rounded-md border border-theme-accent-1/20 bg-theme-light/50 px-3 py-2 text-left text-sm text-theme-dark/80 transition-colors hover:bg-theme-accent-1/20"
                        onClick={() => setInputValue(example)}
                      >
                        <Code className="mr-2 h-4 w-4 text-theme-accent-3" />
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-theme-accent-1 to-theme-accent-2 text-theme-dark transition-transform hover:scale-[1.02] hover:from-theme-accent-2 hover:to-theme-accent-1"
                  disabled={!inputValue.trim()}
                >
                  Generate Workflow
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
          
          {/* Footer note */}
          <motion.p
            className="text-center text-sm text-theme-dark/50"
            variants={itemVariants}
          >
            Our AI automatically creates structured workflows based on your description
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}