import { motion } from 'framer-motion';
import { useState } from 'react';

export function LandingPage({ onSubmit }: { onSubmit: (prompt: string) => void }) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-theme-light via-white to-theme-light/50 p-4">
      {/* Enhanced animated background elements */}
      <motion.div 
        className="absolute left-1/4 top-1/4 -z-10 h-64 w-64 rounded-full bg-theme-accent-1/5"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-theme-accent-2/5"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <motion.h1 
          className="mb-4 text-4xl font-bold text-theme-dark md:text-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Create with AI
        </motion.h1>
        <motion.p 
          className="text-lg text-theme-dark/70 md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Describe your application and I&apos;ll generate the code for you
        </motion.p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.div 
          className={`relative rounded-xl bg-white/80 p-1 shadow-lg backdrop-blur-sm transition-all duration-300 ${
            isFocused ? "ring-2 ring-theme-accent-1 shadow-theme-accent-1/20" : ""
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            boxShadow: isFocused || isHovered 
              ? "0 8px 30px rgba(218, 246, 130, 0.2)" 
              : "0 4px 12px rgba(0, 0, 0, 0.05)"
          }}
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe your application... (e.g., 'Create a weather app with React')"
            className="min-h-[120px] w-full resize-none bg-transparent p-4 text-theme-dark placeholder:text-theme-dark/40 focus:outline-none"
            autoFocus
          />
          <div className="flex justify-end p-2">
            <motion.button
              type="submit"
              className="rounded-lg bg-theme-accent-1 px-4 py-2 font-medium text-theme-dark hover:bg-theme-accent-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!inputValue.trim()}
              initial={{ opacity: 0.9 }}
              animate={{ 
                opacity: inputValue.trim() ? 1 : 0.7,
                backgroundColor: inputValue.trim() 
                  ? "var(--theme-accent-1)" 
                  : "rgba(218, 246, 130, 0.7)"
              }}
            >
              Generate
            </motion.button>
          </div>
        </motion.div>
      </motion.form>

      <motion.div 
        className="mt-8 text-center text-sm text-theme-dark/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Try &quot;Create a weather app&quot;, &quot;Build a portfolio site&quot;, or &quot;Make a Node.js API&quot;
      </motion.div>
    </div>
  );
}