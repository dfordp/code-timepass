"use client"

import { useEffect, useState } from 'react';
import { Maximize2, Minimize2, X, RefreshCw, Code, Copy, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodePreview } from './code-preview';



const getPreviewHtml = (workflowType?: string) => {
  switch (workflowType) {
    case 'weather':
      return `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #F4F9E0; color: #1C2326; font-family: sans-serif;">
          <div style="background-color: white; padding: 2rem; border-radius: 8px; max-width: 80%; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h1 style="margin-bottom: 1rem; color: #1C2326;">Weather App</h1>
            <div style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
              <div style="background-color: #DAF682; padding: 2rem; border-radius: 50%; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                ☀️
              </div>
            </div>
            <div style="background-color: #F4F9E0; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
              <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">72°F</div>
              <div style="color: #9D6263;">Sunny</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
              <div style="text-align: center; padding: 0.5rem; flex: 1;">
                <div>Humidity</div>
                <div style="font-weight: bold; color: #9D6263;">45%</div>
              </div>
              <div style="text-align: center; padding: 0.5rem; flex: 1;">
                <div>Wind</div>
                <div style="font-weight: bold; color: #9D6263;">5 mph</div>
              </div>
              <div style="text-align: center; padding: 0.5rem; flex: 1;">
                <div>Visibility</div>
                <div style="font-weight: bold; color: #9D6263;">10 mi</div>
              </div>
            </div>
          </div>
        </div>
      `;
    case 'portfolio':
      return `
        <div style="height: 100%; font-family: sans-serif; color: #1C2326;">
          <header style="background-color: #1C2326; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: bold; font-size: 1.25rem;">John Developer</div>
            <nav>
              <ul style="display: flex; list-style: none; gap: 1.5rem; margin: 0; padding: 0;">
                <li>About</li>
                <li>Projects</li>
                <li>Contact</li>
              </ul>
            </nav>
          </header>
          
          <main>
            <section style="height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background-color: #F4F9E0;">
              <h1 style="font-size: 3rem; margin-bottom: 1rem;">John Developer</h1>
              <p style="font-size: 1.5rem; margin-bottom: 2rem; color: #9D6263;">Frontend Developer & UI Designer</p>
              <button style="background-color: #DAF682; border: none; padding: 0.75rem 2rem; border-radius: 4px; font-weight: bold; cursor: pointer;">View My Work</button>
            </section>
          </main>
        </div>
      `;
    case 'api':
      return `
        <div style="display: flex; flex-direction: column; height: 100%; font-family: monospace; background-color: #1C2326; color: #F4F9E0; padding: 1.5rem;">
          <div style="background-color: #0F1519; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
            <div style="color: #DAF682; font-weight: bold; margin-bottom: 0.5rem;">GET /api/users</div>
            <pre style="margin: 0; overflow: auto; color: #F4F9E0;">
{
  "users": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    {
      "id": "2",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10
}
            </pre>
          </div>
          
          <div style="background-color: #0F1519; padding: 1rem; border-radius: 4px;">
            <div style="color: #DAF682; font-weight: bold; margin-bottom: 0.5rem;">POST /api/auth/login</div>
            <div style="margin-bottom: 0.5rem; color: #9D6263;">Request:</div>
            <pre style="margin: 0 0 1rem 0; overflow: auto; color: #F4F9E0;">
{
  "email": "john@example.com",
  "password": "password123"
}
            </pre>
            <div style="margin-bottom: 0.5rem; color: #9D6263;">Response:</div>
            <pre style="margin: 0; overflow: auto; color: #F4F9E0;">
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "John Doe",
    "role": "admin"
  }
}
            </pre>
          </div>
        </div>
      `;
    default:
      return `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #F4F9E0;">
          <div style="background-color: white; padding: 2rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h1 style="margin-bottom: 1rem; color: #1C2326;">Application Preview</h1>
            <p style="color: #9D6263;">This is a preview of your application.</p>
          </div>
        </div>
      `;
  }
};


interface PreviewProps {
  isVisible: boolean;
  onClose: () => void;
  workflowType?: 'weather' | 'portfolio' | 'api';
  previewHtml?: string;
}


export function WorkflowPreview({ isVisible, onClose, workflowType,previewHtml }: PreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(true);


  
    useEffect(() => {
      if (isVisible) {
        setLoadingPreview(true);
        // Simulate loading the preview
        const timer = setTimeout(() => {
          setLoadingPreview(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [isVisible]);


  const defaultPreviewHtml = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #F4F9E0; color: #1C2326; font-family: sans-serif;">
      <div style="background-color: white; padding: 2rem; border-radius: 8px; max-width: 80%; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="margin-bottom: 1rem; color: #1C2326;">Weather App</h1>
        <div style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
          <div style="background-color: #DAF682; padding: 2rem; border-radius: 50%; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
            ☀️
          </div>
        </div>
        <div style="background-color: #F4F9E0; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
          <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">72°F</div>
          <div style="color: #9D6263;">Sunny</div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
          <div style="text-align: center; padding: 0.5rem; flex: 1;">
            <div>Humidity</div>
            <div style="font-weight: bold; color: #9D6263;">45%</div>
          </div>
          <div style="text-align: center; padding: 0.5rem; flex: 1;">
            <div>Wind</div>
            <div style="font-weight: bold; color: #9D6263;">5 mph</div>
          </div>
          <div style="text-align: center; padding: 0.5rem; flex: 1;">
            <div>Visibility</div>
            <div style="font-weight: bold; color: #9D6263;">10 mi</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Sample React code for the preview
  const sampleReactCode = `// Weather App Component
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather', {
            params: {
              q: 'New York',
              units: 'imperial',
              appid: 'YOUR_API_KEY'
            }
          }
        );
        setWeather(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchWeather();
  }, []);
  
  if (loading) return <div>Loading weather data...</div>;
  if (error) return <div>{error}</div>;
  if (!weather) return null;
  
  return (
    <div className="weather-app">
      <h1>{weather.name} Weather</h1>
      <div className="weather-icon">
        {weather.weather[0].main === 'Clear' ? '☀️' : 
         weather.weather[0].main === 'Clouds' ? '☁️' : 
         weather.weather[0].main === 'Rain' ? '🌧️' : '❓'}
      </div>
      <div className="temperature">
        <div className="temp">{Math.round(weather.main.temp)}°F</div>
        <div className="description">{weather.weather[0].description}</div>
      </div>
      <div className="details">
        <div className="detail">
          <div>Humidity</div>
          <div>{weather.main.humidity}%</div>
        </div>
        <div className="detail">
          <div>Wind</div>
          <div>{Math.round(weather.wind.speed)} mph</div>
        </div>
        <div className="detail">
          <div>Visibility</div>
          <div>{(weather.visibility / 1609).toFixed(1)} mi</div>
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleReactCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {loadingPreview && (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <motion.div 
        className="h-12 w-12 rounded-full border-4 border-theme-accent-1/20 border-t-theme-accent-1"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-theme-dark"
      >
        Loading preview...
      </motion.p>
    </div>
  )}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-theme-dark/50 backdrop-blur-sm",
        !isVisible && "pointer-events-none"
      )}
    >
      <motion.div 
        className={cn(
          "relative mx-4 overflow-hidden rounded-lg border border-theme-accent-1/30 bg-white shadow-xl",
          isFullscreen ? "h-[95vh] w-[95vw]" : "h-[85vh] w-[90vw] max-w-4xl"
        )}
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between border-b border-theme-accent-1/10 bg-theme-light p-3">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-theme-accent-3"></div>
            <div className="h-3 w-3 rounded-full bg-theme-accent-1"></div>
            <div className="h-3 w-3 rounded-full bg-theme-accent-2"></div>
          </div>
          
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'preview' | 'code')}
            className="h-8"
          >
            <TabsList className="grid h-8 w-[180px] grid-cols-2 bg-theme-accent-1/10">
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-theme-accent-1 data-[state=active]:text-theme-dark"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger 
                value="code" 
                className="data-[state=active]:bg-theme-accent-1 data-[state=active]:text-theme-dark"
              >
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 text-theme-dark hover:bg-theme-accent-1/20"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8 text-theme-dark hover:bg-theme-accent-1/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="h-[calc(100%-48px)] w-full overflow-auto">
        {activeTab === 'preview' ? (
  <div className="relative h-full w-full">
    <iframe
      srcDoc={defaultPreviewHtml || getPreviewHtml(workflowType)}
      className="h-full w-full border-0"
      title="Preview"
    />
    <Button
      variant="outline"
      size="sm"
      className="absolute bottom-4 right-4 bg-white/90 shadow-md hover:bg-white"
      onClick={() => {/* Refresh preview logic */}}
    >
      <RefreshCw className="mr-1 h-3 w-3" />
      Refresh
    </Button>
  </div>
) : (
  <div className="relative h-full">
    <CodePreview 
      code={sampleReactCode} 
      title={workflowType === 'weather' ? 'WeatherApp.jsx' : 
             workflowType === 'portfolio' ? 'Portfolio.jsx' : 
             workflowType === 'api' ? 'server.js' : 'App.jsx'}
      language="jsx"
      className="h-full border-0 rounded-none"
    />
  </div>
)}
                </div>
      </motion.div>
    </motion.div>
    </>
  );
}