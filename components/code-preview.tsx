"use client"

import { useEffect, useState } from 'react';
import { Copy, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export function CodePreview({ code, language = 'javascript', title, className }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    // Split code into lines for better rendering
    setLines(code.split('\n'));
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-md overflow-hidden border border-theme-accent-1/20 shadow-sm", className)}>
      {title && (
        <div className="flex items-center justify-between border-b border-theme-accent-1/10 bg-slate-50 px-4 py-2">
          <span className="text-sm font-medium text-slate-700">{title}</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0 hover:bg-slate-200"
          >
            {copied ? 
              <CheckCheck className="h-4 w-4 text-green-600" /> : 
              <Copy className="h-4 w-4 text-slate-600" />
            }
          </Button>
        </div>
      )}
      
      <div className="max-h-[50vh] overflow-auto bg-slate-50 p-0">
        <pre className="p-4 font-mono text-[14px] leading-relaxed">
          <code className={`language-${language}`}>
            {lines.map((line, idx) => (
              <div key={idx} className="flex hover:bg-slate-100">
                <span className="mr-4 inline-block w-10 select-none border-r border-slate-200 pr-2 text-right text-slate-400">
                  {idx + 1}
                </span>
                <span className="pl-3 text-slate-800">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}