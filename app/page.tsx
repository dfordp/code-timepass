"use client"

import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGroup } from 'framer-motion';
import { Download, Share, Code, MessageCircle , Copy, CheckCheck, Eye, TerminalIcon} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ButterflowWorkflowVisualization } from '@/components/workflow-visualization';
import { Workflow as WorkflowType } from '@/types';
import { WorkflowPreview } from '@/components/workflow-preview';
import { ChatInterface } from '@/components/chat-interface';
import { LandingPage } from '@/components/landing-page';
import { LangChainMessage } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThinkingIndicator } from '@/components/thinking-indicator';
import { CodeGeneration } from '@/components/code-generation';
import { CodeEditor } from '@/components/code-editor';
import { Terminal } from '@/components/terminal';
import { ArrowLeft } from 'lucide-react';


export default function IndexPage() {
  const [messages, setMessages] = useState<LangChainMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [workflow, setWorkflow] = useState<WorkflowType | null>(null);
  const [showMobileView, setShowMobileView] = useState<'chat' | 'workflow'>('chat');
  const [landingMode, setLandingMode] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeCode, setSelectedNodeCode] = useState<string | null>(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const _threadId = useRef(uuid());
  
  const hasWorkflow = workflow !== null;



const handleOpenTerminal = () => {
  setShowTerminal(true);
  setIsTerminalMinimized(false);
};

const handleCloseTerminal = () => {
  setShowTerminal(false);
};

const handleMinimizeTerminal = () => {
  setIsTerminalMinimized(!isTerminalMinimized);
};

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
      setGeneratingCode(true);
  
      try {
        // In a real implementation, this would call the streamWorkflow function
        // For now, we'll simulate a response after a delay
        await new Promise((resolve) => setTimeout(resolve, 3000));
  
        // Create a response based on the user's input
        let responseContent = "";
        let generatedWorkflow: WorkflowType | null = null;
        
        // Generate different responses based on content patterns
        if (content.toLowerCase().includes("weather")) {
          responseContent = "I've created a workflow for a React weather application. The app will fetch data from a weather API, display current conditions, forecasts, and allow location search. Key components include a weather service layer, UI components for displaying weather data, and a responsive layout.";
          generatedWorkflow = createWeatherAppWorkflow();
        } else if (content.toLowerCase().includes("api") || content.toLowerCase().includes("node")) {
          responseContent = "I've designed a workflow for a Node.js API with authentication and MongoDB integration. The system includes user authentication with JWT, MongoDB data models, RESTful endpoints, and proper error handling. This architecture follows best practices for security and scalability.";
          generatedWorkflow = createNodeApiWorkflow();
        } else if (content.toLowerCase().includes("portfolio") || content.toLowerCase().includes("website")) {
          responseContent = "I've created a workflow for a modern portfolio website using Next.js and Tailwind CSS. The site will include a responsive layout, project showcases, contact form, and optimized images. This architecture leverages Next.js for SEO benefits and Tailwind for efficient styling.";
          generatedWorkflow = createPortfolioWorkflow();
        } else {
          responseContent = "I've created a workflow based on your request. This workflow architecture includes the core components, data flow, and key functionality needed for your application. You can explore each section in the visualization.";
          generatedWorkflow = createGenericWorkflow();
        }
  
        // Simulate AI response
        const aiMessage: LangChainMessage = {
          id: uuid(),
          type: 'ai',
          content: responseContent,
        };
  
        setMessages((prev) => [...prev, aiMessage]);
        console.log("Setting workflow:", generatedWorkflow);
        setWorkflow(generatedWorkflow);

        setGeneratingCode(false);

      // If workflow was generated, select the first node to show its code
      if (generatedWorkflow && generatedWorkflow.nodes.length > 0) {
        // Store the first node in a constant to ensure type safety
        const workflowFirstNode = generatedWorkflow.nodes[0];
        
        setTimeout(() => {
          setSelectedNodeId(workflowFirstNode.id);
          setSelectedNodeCode(workflowFirstNode.code_snippet || null);
        }, 800);
      }

  
      } catch (error) {
        console.error('Error in chat:', error);
        
        // Add error message to chat
        const errorMessage: LangChainMessage = {
          id: uuid(),
          type: 'ai',
          content:
            "I'm sorry, but I encountered an error while processing your request. Please try again with a different description.",
        };
        
        setMessages((prev) => [...prev, errorMessage]);
        setGeneratingCode(false);

      } finally {
        setIsLoading(false);
      }
    };

    const handleNodeSelect = (id: string) => {
    const selectedNode = workflow?.nodes.find(node => node.id === id);
    setSelectedNodeId(id);
    setSelectedNodeCode(selectedNode?.code_snippet || null);
  };
  
    // Helper functions to create different workflow types
    const createWeatherAppWorkflow = (): WorkflowType => {
      return {
        version: '1.0',
        name: 'React Weather Application',
        description: 'A weather application built with React that fetches and displays weather data from an API',
        nodes: [
          {
            id: 'app-init',
            name: 'App Initialization',
            type: 'automatic',
            description: 'Set up React app with environment variables for API keys',
            steps: [],
            code_snippet: `// App initialization
  import React from 'react';
  import { WeatherProvider } from './context/WeatherContext';
  import Dashboard from './components/Dashboard';
  import './App.css';
  
  const App = () => {
    return (
      <WeatherProvider>
        <div className="weather-app">
          <Dashboard />
        </div>
      </WeatherProvider>
    );
  };
  
  export default App;`
          },
          {
            id: 'api-service',
            name: 'Weather API Service',
            type: 'automatic',
            description: 'Service layer to handle API requests to weather data provider',
            depends_on: ['app-init'],
            steps: [],
            code_snippet: `// api/weatherService.js
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const BASE_URL = 'https://api.weatherapi.com/v1';
  
  export const fetchWeatherData = async (location) => {
    try {
      const response = await fetch(
        \`\${BASE_URL}/forecast.json?key=\${API_KEY}&q=\${location}&days=3\`
      );
      
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  };`
          },
          {
            id: 'context',
            name: 'Weather Context',
            type: 'automatic',
            description: 'React context to manage weather state across components',
            depends_on: ['api-service'],
            steps: [],
            code_snippet: `// context/WeatherContext.jsx
  import React, { createContext, useState, useContext } from 'react';
  import { fetchWeatherData } from '../api/weatherService';
  
  const WeatherContext = createContext();
  
  export const WeatherProvider = ({ children }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const getWeather = async (searchLocation) => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchWeatherData(searchLocation || location);
        setWeatherData(data);
        setLocation(searchLocation || location);
      } catch (err) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <WeatherContext.Provider
        value={{
          weatherData,
          location,
          setLocation,
          getWeather,
          loading,
          error,
        }}
      >
        {children}
      </WeatherContext.Provider>
    );
  };
  
  export const useWeather = () => useContext(WeatherContext);`
          },
          {
            id: 'ui-components',
            name: 'UI Components',
            type: 'manual',
            description: 'React components for displaying weather information',
            depends_on: ['context'],
            steps: [],
            code_snippet: `// components/CurrentWeather.jsx
  import React from 'react';
  import { useWeather } from '../context/WeatherContext';
  
  const CurrentWeather = () => {
    const { weatherData, loading } = useWeather();
    
    if (loading) return <div className="loading">Loading weather data...</div>;
    if (!weatherData) return null;
    
    const current = weatherData.current;
    
    return (
      <div className="current-weather">
        <div className="weather-icon">
          <img src={current.condition.icon} alt={current.condition.text} />
        </div>
        <div className="weather-info">
          <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
          <div className="temperature">{current.temp_c}°C</div>
          <div className="condition">{current.condition.text}</div>
          <div className="details">
            <span>Feels like: {current.feelslike_c}°C</span>
            <span>Humidity: {current.humidity}%</span>
            <span>Wind: {current.wind_kph} km/h</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default CurrentWeather;`
          },
          {
            id: 'search',
            name: 'Location Search',
            type: 'automatic',
            description: 'Component for searching weather by location',
            depends_on: ['context'],
            steps: [],
            code_snippet: `// components/Search.jsx
  import React, { useState } from 'react';
  import { useWeather } from '../context/WeatherContext';
  
  const Search = () => {
    const [searchInput, setSearchInput] = useState('');
    const { getWeather, loading } = useWeather();
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (searchInput.trim()) {
        getWeather(searchInput);
      }
    };
    
    return (
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search location..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !searchInput.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    );
  };
  
  export default Search;`
          },
          {
            id: 'forecast',
            name: 'Weather Forecast',
            type: 'automatic',
            description: 'Component to display multi-day weather forecast',
            depends_on: ['ui-components'],
            steps: [],
            code_snippet: `// components/Forecast.jsx
  import React from 'react';
  import { useWeather } from '../context/WeatherContext';
  
  const Forecast = () => {
    const { weatherData, loading } = useWeather();
    
    if (loading || !weatherData) return null;
    
    const { forecast } = weatherData;
    
    return (
      <div className="forecast">
        <h3>3-Day Forecast</h3>
        <div className="forecast-container">
          {forecast.forecastday.map((day) => (
            <div key={day.date} className="forecast-day">
              <div className="date">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <img src={day.day.condition.icon} alt={day.day.condition.text} />
              <div className="temp-range">
                <span className="max">{Math.round(day.day.maxtemp_c)}°</span>
                <span className="min">{Math.round(day.day.mintemp_c)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Forecast;`
          },
          {
            id: 'dashboard',
            name: 'Weather Dashboard',
            type: 'automatic',
            description: 'Main dashboard component combining all weather features',
            depends_on: ['search', 'forecast'],
            steps: [],
            code_snippet: `// components/Dashboard.jsx
  import React, { useEffect } from 'react';
  import { useWeather } from '../context/WeatherContext';
  import Search from './Search';
  import CurrentWeather from './CurrentWeather';
  import Forecast from './Forecast';
  
  const Dashboard = () => {
    const { getWeather, error } = useWeather();
    
    useEffect(() => {
      // Get default weather on mount
      getWeather('London');
    }, []);
    
    return (
      <div className="dashboard">
        <h1>Weather Forecast</h1>
        <Search />
        
        {error && <div className="error">{error}</div>}
        
        <div className="weather-content">
          <CurrentWeather />
          <Forecast />
        </div>
      </div>
    );
  };
  
  export default Dashboard;`
          },
        ],
      };
    };
  
    const createNodeApiWorkflow = (): WorkflowType => {
      return {
        version: '1.0',
        name: 'Node.js API with Authentication',
        description: 'A RESTful API built with Node.js, Express, MongoDB, and JWT authentication',
        nodes: [
          {
            id: 'setup',
            name: 'Project Setup',
            type: 'automatic',
            description: 'Initialize Node.js project with dependencies',
            steps: [],
            code_snippet: `// package.json
  {
    "name": "node-auth-api",
    "version": "1.0.0",
    "description": "Node.js API with authentication",
    "main": "server.js",
    "scripts": {
      "start": "node server.js",
      "dev": "nodemon server.js"
    },
    "dependencies": {
      "bcryptjs": "^2.4.3",
      "cors": "^2.8.5",
      "dotenv": "^10.0.0",
      "express": "^4.17.1",
      "jsonwebtoken": "^8.5.1",
      "mongoose": "^6.0.12",
      "morgan": "^1.10.0"
    },
    "devDependencies": {
      "nodemon": "^2.0.14"
    }
  }`
          },
          {
            id: 'db-config',
            name: 'Database Configuration',
            type: 'automatic',
            description: 'Set up MongoDB connection',
            depends_on: ['setup'],
            steps: [],
            code_snippet: `// config/database.js
  const mongoose = require('mongoose');
  
  const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      console.log(\`MongoDB Connected: \${conn.connection.host}\`);
    } catch (error) {
      console.error(\`Error: \${error.message}\`);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;`
          },
          {
            id: 'models',
            name: 'Data Models',
            type: 'automatic',
            description: 'Define MongoDB schemas and models',
            depends_on: ['db-config'],
            steps: [],
            code_snippet: `// models/User.js
  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');
  
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  // Encrypt password using bcrypt
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  // Match user entered password to hashed password in database
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  module.exports = mongoose.model('User', userSchema);`
          },
          {
            id: 'auth-middleware',
            name: 'Authentication Middleware',
            type: 'manual',
            description: 'JWT authentication and authorization middleware',
            depends_on: ['models'],
            steps: [],
            code_snippet: `// middleware/auth.js
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  
  exports.protect = async (req, res, next) => {
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }
  };
  
  // Grant access to specific roles
  exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: \`User role \${req.user.role} is not authorized to access this route\`,
        });
      }
      next();
    };
  };`
          },
          {
            id: 'auth-controllers',
            name: 'Auth Controllers',
            type: 'automatic',
            description: 'Controllers for user registration, login, and profile',
            depends_on: ['auth-middleware'],
            steps: [],
            code_snippet: `// controllers/auth.js
  const User = require('../models/User');
  const jwt = require('jsonwebtoken');
  
  // Generate JWT
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };
  
  // @desc    Register user
  // @route   POST /api/v1/auth/register
  // @access  Public
  exports.register = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      
      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role,
      });
      
      // Create token
      const token = generateToken(user._id);
      
      res.status(201).json({
        success: true,
        token,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };
  
  // @desc    Login user
  // @route   POST /api/v1/auth/login
  // @access  Public
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate email & password
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Please provide an email and password',
        });
      }
      
      // Check for user
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }
      
      // Check if password matches
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }
      
      // Create token
      const token = generateToken(user._id);
      
      res.status(200).json({
        success: true,
        token,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  
  // @desc    Get current logged in user
  // @route   GET /api/v1/auth/me
  // @access  Private
  exports.getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };`
          },
          {
            id: 'routes',
            name: 'API Routes',
            type: 'automatic',
            description: 'Define Express routes for the API',
            depends_on: ['auth-controllers'],
            steps: [],
            code_snippet: `// routes/auth.js
  const express = require('express');
  const { register, login, getMe } = require('../controllers/auth');
  const { protect } = require('../middleware/auth');
  
  const router = express.Router();
  
  router.post('/register', register);
  router.post('/login', login);
  router.get('/me', protect, getMe);
  
  module.exports = router;`
          },
          {
            id: 'server',
            name: 'Express Server',
            type: 'automatic',
            description: 'Configure and start the Express server',
            depends_on: ['routes'],
            steps: [],
            code_snippet: `// server.js
  const express = require('express');
  const dotenv = require('dotenv');
  const morgan = require('morgan');
  const cors = require('cors');
  const connectDB = require('./config/database');
  
  // Load env vars
  dotenv.config({ path: './config/config.env' });
  
  // Connect to database
  connectDB();
  
  // Route files
  const auth = require('./routes/auth');
  
  const app = express();
  
  // Body parser
  app.use(express.json());
  
  // Enable CORS
  app.use(cors());
  
  // Dev logging middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  
  // Mount routers
  app.use('/api/v1/auth', auth);
  
  // Error handler
  app.use((err, req, res, next) => {
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error',
    });
  });
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(\`Server running in \${process.env.NODE_ENV} mode on port \${PORT}\`);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(\`Error: \${err.message}\`);
    // Close server & exit process
    process.exit(1);
  });`
          },
        ],
      };
    };
  
    const createPortfolioWorkflow = (): WorkflowType => {
      return {
        version: '1.0',
        name: 'Next.js Portfolio Website',
        description: 'A modern portfolio website built with Next.js and Tailwind CSS',
        nodes: [
          {
            id: 'setup',
            name: 'Project Setup',
            type: 'automatic',
            description: 'Initialize Next.js project with Tailwind CSS',
            steps: [],
            code_snippet: `// Terminal commands
  npx create-next-app portfolio-site
  cd portfolio-site
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p`
          },
          {
            id: 'tailwind-config',
            name: 'Tailwind Configuration',
            type: 'automatic',
            description: 'Configure Tailwind CSS for the project',
            depends_on: ['setup'],
            steps: [],
            code_snippet: `// tailwind.config.js
  /** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
          secondary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          mono: ['Fira Code', 'monospace'],
        },
        typography: {
          DEFAULT: {
            css: {
              maxWidth: '65ch',
              color: 'inherit',
              a: {
                color: '#0ea5e9',
                '&:hover': {
                  color: '#0284c7',
                },
              },
            },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms'),
    ],
  };`
          },
          {
            id: 'layout',
            name: 'Layout Components',
            type: 'manual',
            description: 'Create layout components for consistent page structure',
            depends_on: ['tailwind-config'],
            steps: [],
            code_snippet: `// components/layout/Layout.js
  import Head from 'next/head';
  import Navbar from './Navbar';
  import Footer from './Footer';
  
  export default function Layout({ children, title = 'Portfolio' }) {
    return (
      <div className="flex min-h-screen flex-col">
        <Head>
          <title>{title} | Developer Portfolio</title>
          <meta name="description" content="My professional portfolio website" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </div>
    );
  }`
          },
          {
            id: 'navbar',
            name: 'Navigation',
            type: 'automatic',
            description: 'Create responsive navigation with mobile menu',
            depends_on: ['layout'],
            steps: [],
            code_snippet: `// components/layout/Navbar.js
  import { useState } from 'react';
  import Link from 'next/link';
  import { useRouter } from 'next/router';
  
  export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    
    const navLinks = [
      { href: '/', label: 'Home' },
      { href: '/projects', label: 'Projects' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ];
    
    const isActive = (path) => router.pathname === path;
    
    return (
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="text-xl font-bold text-primary-600">
                John.dev
              </a>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden space-x-8 md:flex">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={\`\${
                      isActive(link.href)
                        ? 'text-primary-600 font-medium'
                        : 'text-secondary-600 hover:text-primary-600'
                    } transition-colors\`}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
            
            {/* Mobile menu button */}
            <button
              className="flex items-center md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="h-6 w-6 text-secondary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isOpen && (
            <div className="mt-4 flex flex-col space-y-4 pb-4 md:hidden">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={\`\${
                      isActive(link.href)
                        ? 'text-primary-600 font-medium'
                        : 'text-secondary-600'
                    } block py-2\`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          )}
        </nav>
      </header>
    );
  }`
          },
          {
            id: 'hero',
            name: 'Hero Section',
            type: 'automatic',
            description: 'Create hero section for landing page',
            depends_on: ['navbar'],
            steps: [],
            code_snippet: `// components/sections/Hero.js
  import Image from 'next/image';
  import Link from 'next/link';
  
  export default function Hero() {
    return (
      <section className="bg-gradient-to-b from-white to-primary-50">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium text-primary-600">Hello, I'm</p>
              <h1 className="mt-2 text-4xl font-bold text-secondary-900 md:text-5xl lg:text-6xl">
                John Doe
              </h1>
              <h2 className="mt-4 text-2xl font-medium text-secondary-700 md:text-3xl">
                Full Stack Developer
              </h2>
              <p className="mt-6 text-lg text-secondary-600">
                I build modern, responsive web applications with React, Next.js, 
                and Node.js. Let's work together to bring your ideas to life.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/projects">
                  <a className="rounded-md bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-700">
                    View My Work
                  </a>
                </Link>
                <Link href="/contact">
                  <a className="rounded-md border border-primary-600 px-6 py-3 text-primary-600 transition-colors hover:bg-primary-50">
                    Contact Me
                  </a>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-64 w-64 overflow-hidden rounded-full md:h-80 md:w-80">
                <Image
                  src="/images/profile.jpg"
                  alt="John Doe"
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }`
          },
          {
            id: 'projects',
            name: 'Projects Section',
            type: 'automatic',
            description: 'Create projects showcase section',
            depends_on: ['hero'],
            steps: [],
            code_snippet: `// components/sections/Projects.js
  import Image from 'next/image';
  import Link from 'next/link';
  
  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-featured online store built with Next.js, Stripe, and a headless CMS.',
      image: '/images/projects/ecommerce.jpg',
      tags: ['Next.js', 'Stripe', 'Tailwind CSS', 'Sanity.io'],
      link: '/projects/ecommerce',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A productivity app with drag-and-drop interface, user authentication, and real-time updates.',
      image: '/images/projects/task-app.jpg',
      tags: ['React', 'Firebase', 'Redux', 'Material UI'],
      link: '/projects/task-app',
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'A weather application that provides forecasts, radar maps, and alerts based on location.',
      image: '/images/projects/weather.jpg',
      tags: ['JavaScript', 'Chart.js', 'Weather API', 'Geolocation'],
      link: '/projects/weather',
    },
  ];
  
  export default function Projects() {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-secondary-900 md:text-4xl">
              Featured Projects
            </h2>
            <p className="mt-4 text-lg text-secondary-600">
              Check out some of my recent work
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={project.link}>
                <a className="group overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:-translate-y-1">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-secondary-900">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-secondary-600">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/projects">
              <a className="inline-flex items-center text-primary-600 hover:text-primary-700">
                View All Projects
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </Link>
          </div>
        </div>
      </section>
    );
  }`
          },
          {
            id: 'contact',
            name: 'Contact Form',
            type: 'automatic',
            description: 'Create contact form with validation',
            depends_on: ['projects'],
            steps: [],
            code_snippet: `// components/sections/Contact.js
  import { useState } from 'react';
  
  export default function Contact() {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
      
      if (!formData.message.trim()) {
        newErrors.message = 'Message is required';
      } else if (formData.message.trim().length < 10) {
        newErrors.message = 'Message must be at least 10 characters';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors((prev) => ({
          ...prev,
          form: 'Something went wrong. Please try again.',
        }));
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return (
      <section className="bg-secondary-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-secondary-900 md:text-4xl">
                Get In Touch
              </h2>
              <p className="mt-4 text-lg text-secondary-600">
                Have a project in mind or want to chat? Send me a message!
              </p>
            </div>
            
            {submitSuccess ? (
              <div className="rounded-lg bg-green-50 p-6 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-secondary-900">
                  Message Sent Successfully!
                </h3>
                <p className="mt-2 text-secondary-600">
                  Thanks for reaching out. I'll get back to you as soon as possible.
                </p>
                <button
                  className="mt-6 rounded-md bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
                  onClick={() => setSubmitSuccess(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.form && (
                  <div className="rounded-md bg-red-50 p-4 text-red-600">
                    {errors.form}
                  </div>
                )}
                
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-secondary-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={\`mt-1 block w-full rounded-md border \${
                      errors.name ? 'border-red-500' : 'border-secondary-300'
                    } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500\`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-secondary-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={\`mt-1 block w-full rounded-md border \${
                      errors.email ? 'border-red-500' : 'border-secondary-300'
                    } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500\`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-secondary-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={\`mt-1 block w-full rounded-md border \${
                      errors.message ? 'border-red-500' : 'border-secondary-300'
                    } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500\`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-primary-600 px-4 py-2 text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-75"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }`
          },
          {
            id: 'footer',
            name: 'Footer Component',
            type: 'automatic',
            description: 'Create footer with social links and navigation',
            depends_on: ['contact'],
            steps: [],
            code_snippet: `// components/layout/Footer.js
  import Link from 'next/link';
  
  export default function Footer() {
    const year = new Date().getFullYear();
    
    const socialLinks = [
      {
        name: 'GitHub',
        url: 'https://github.com/johndoe',
        icon: (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/johndoe',
        icon: (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
          </svg>
        ),
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/johndoe',
        icon: (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        ),
      },
    ];
    
    const footerLinks = [
      { href: '/', label: 'Home' },
      { href: '/projects', label: 'Projects' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/blog', label: 'Blog' },
    ];
    
    return (
      <footer className="bg-secondary-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-xl font-bold">John.dev</h3>
              <p className="mt-4 text-secondary-300">
                Building modern web experiences with cutting-edge technologies.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium">Quick Links</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <a className="text-secondary-300 hover:text-white">
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium">Connect</h4>
              <ul className="mt-4 space-y-2">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-secondary-300 hover:text-white"
                    >
                      <span className="mr-2">{link.icon}</span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium">Newsletter</h4>
              <p className="mt-4 text-secondary-300">
                Subscribe to get updates on my latest projects and blog posts.
              </p>
              <form className="mt-4">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full rounded-l-md border-0 bg-secondary-800 px-4 py-2 text-white placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="rounded-r-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-12 border-t border-secondary-800 pt-8 text-center text-sm text-secondary-400">
            <p>© {year} John Doe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }`
          },
        ],
      };
    };
  
    const createGenericWorkflow = (): WorkflowType => {
      return {
        version: '1.0',
        name: 'Generic Application',
        description: 'A multi-component application architecture',
        nodes: [
          {
            id: 'frontend',
            name: 'Frontend Layer',
            type: 'automatic',
            description: 'User interface components and state management',
            steps: [],
            code_snippet: `// Example frontend code
  import React, { useState, useEffect } from 'react';
  import { fetchData } from '../services/api';
  
  function MainComponent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      async function loadData() {
        try {
          const result = await fetchData();
          setData(result);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      }
      
      loadData();
    }, []);
    
    return (
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {data.map(item => (
              <div key={item.id}>{item.name}</div>
            ))}
          </div>
        )}
      </div>
    );
  }`
          },
          {
            id: 'api-layer',
            name: 'API Layer',
            type: 'automatic',
            description: 'RESTful API endpoints for data operations',
            depends_on: ['frontend'],
            steps: [],
            code_snippet: `// Example API layer
  const express = require('express');
  const router = express.Router();
  const { getItems, getItemById, createItem, updateItem, deleteItem } = require('../controllers/items');
  const { protect } = require('../middleware/auth');
  
  // Public routes
  router.get('/items', getItems);
  router.get('/items/:id', getItemById);
  
  // Protected routes
  router.post('/items', protect, createItem);
  router.put('/items/:id', protect, updateItem);
  router.delete('/items/:id', protect, deleteItem);
  
  module.exports = router;`
          },
          {
            id: 'data-models',
            name: 'Data Models',
            type: 'automatic',
            description: 'Database schemas and data models',
            depends_on: ['api-layer'],
            steps: [],
            code_snippet: `// Example data model
  const mongoose = require('mongoose');
  
  const itemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['technology', 'science', 'art', 'other']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  });
  
  module.exports = mongoose.model('Item', itemSchema);`
          },
          {
            id: 'auth-service',
            name: 'Authentication Service',
            type: 'manual',
            description: 'User authentication and authorization',
            depends_on: ['data-models'],
            steps: [],
            code_snippet: `// Example authentication service
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
  const User = require('../models/User');
  
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  };
  
  exports.register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      // Create user
      const user = await User.create({
        name,
        email,
        password
      });
      
      // Create token
      const token = generateToken(user._id);
      
      res.status(201).json({ success: true, token });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
  
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate email & password
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Please provide an email and password'
        });
      }
      
      // Check for user
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
      
      // Check if password matches
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
      
      // Create token
      const token = generateToken(user._id);
      
      res.status(200).json({ success: true, token });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };`
          },
          {
            id: 'backend-logic',
            name: 'Business Logic',
            type: 'automatic',
            description: 'Core application business logic and rules',
            depends_on: ['auth-service'],
            steps: [],
            code_snippet: `// Example business logic controller
  const Item = require('../models/Item');
  
  // @desc    Get all items
  // @route   GET /api/items
  // @access  Public
  exports.getItems = async (req, res) => {
    try {
      const items = await Item.find().populate('user', 'name email');
      
      res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  };
  
  // @desc    Create new item
  // @route   POST /api/items
  // @access  Private
  exports.createItem = async (req, res) => {
    try {
      // Add user to req.body
      req.body.user = req.user.id;
      
      // Create item
      const item = await Item.create(req.body);
      
      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        
        return res.status(400).json({
          success: false,
          error: messages
        });
      } else {
        return res.status(500).json({
          success: false,
          error: 'Server Error'
        });
      }
    }
  };`
          },
          {
            id: 'database',
            name: 'Database',
            type: 'automatic',
            description: 'Data storage and retrieval',
            depends_on: ['backend-logic'],
            steps: [],
            code_snippet: `// Example database connection
  const mongoose = require('mongoose');
  
  const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      console.log(\`MongoDB Connected: \${conn.connection.host}\`);
    } catch (error) {
      console.error(\`Error: \${error.message}\`);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;`
          },
        ],
      };
    };

  // If in landing mode, show the clean landing page
  if (landingMode) {
    return <LandingPage onSubmit={handleSendMessage} />;
  }

  const getWorkflowPreviewType = (workflow: WorkflowType | null): 'weather' | 'portfolio' | 'api' | undefined => {
  if (!workflow) return undefined;
  
  const name = workflow.name.toLowerCase();
  if (name.includes('weather')) return 'weather';
  if (name.includes('portfolio') || name.includes('website')) return 'portfolio';
  if (name.includes('api') || name.includes('node')) return 'api';
  
  return undefined;
};

  return (
  <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-theme-light via-white to-theme-light/50 p-4 md:p-8">
      {/* Background decorative elements */}
      <div className="absolute left-0 top-0 -z-10 h-64 w-64 rounded-full bg-theme-accent-1/5 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-theme-accent-2/5 blur-3xl"></div>
      
      {/* Mobile Toggle - Only on mobile */}
      <div className="mb-2 flex md:hidden">
        <Button
          variant={showMobileView === 'chat' ? 'default' : 'outline'}
          onClick={() => setShowMobileView('chat')}
          className="flex-1 rounded-l-lg rounded-r-none border-theme-accent-1 bg-theme-accent-1 text-theme-dark hover:bg-theme-accent-2"
        >
          Chat
        </Button>
        <Button
          variant={showMobileView === 'workflow' ? 'default' : 'outline'}
          onClick={() => setShowMobileView('workflow')}
          className="flex-1 rounded-l-none rounded-r-lg border-theme-accent-1 bg-theme-accent-1 text-theme-dark hover:bg-theme-accent-2"
          disabled={!hasWorkflow}
        >
          Workflow
          {hasWorkflow && <Badge className="ml-2 bg-theme-accent-3 text-theme-light">1</Badge>}
        </Button>
      </div>

      {/* Main two-pane layout container */}
      <LayoutGroup>
      <div className="flex flex-1 overflow-hidden">
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
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <Card className="flex h-full w-full flex-col overflow-hidden border-theme-accent-1/30 bg-white/90 shadow-lg backdrop-blur-sm">
              <CardHeader className="border-b border-theme-accent-1/10 bg-white/80 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-theme-dark">
                    AI Chat
                  </CardTitle>
                  {chatStarted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-theme-dark/70 hover:bg-theme-accent-1/10"
                      onClick={() => {
                        // Reset the application state
                        setLandingMode(true);
                        setChatStarted(false);
                        setMessages([]);
                        setWorkflow(null);
                        setShowMobileView('chat');
                      }}
                      title="Start a new chat"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                    </Button>
                  )}
                </div>
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
          <AnimatePresence mode="wait">
            {hasWorkflow && (
              <motion.div
                className={cn(
                  'flex h-full overflow-hidden',
                  showMobileView === 'chat' ? 'hidden md:flex' : 'flex'
                )}
                initial={{ width: 0, opacity: 0, x: '5%' }}
                animate={{ width: '60%', opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: '5%' }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  opacity: { duration: 0.2 }
                }}
                layout
              >
                <Card className="flex h-full w-full flex-col overflow-hidden border-theme-accent-1/30 bg-white/90 shadow-lg backdrop-blur-sm">
                  <CardHeader className="border-b border-theme-accent-1/10 bg-white/80 pb-2">
                    <motion.div 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <CardTitle className="flex items-center text-theme-dark">
                        <Code className="mr-2 h-4 w-4 text-theme-accent-3" />
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                        >
                          {workflow ? workflow.name : 'AI Chat'}
                        </motion.span>
                        {workflow && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7, duration: 0.3 }}
                          >
                            <Badge variant="outline" className="ml-2 bg-theme-accent-1/10 text-xs font-normal">
                              v{workflow.version}
                            </Badge>
                          </motion.div>
                        )}
                      </CardTitle>
                      
                      {hasWorkflow && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8, duration: 0.3 }}
                        >
                          <WorkflowActions 
                            workflow={workflow} 
                            onPreview={() => setPreviewVisible(true)}
                            selectedNodeId={selectedNodeId}
                            selectedNodeCode={selectedNodeCode}
                            setShowCodeEditor={setShowCodeEditor}
                            handleOpenTerminal={handleOpenTerminal}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                    
                    {workflow && (
                      <motion.p 
                        className="mt-1 text-xs text-theme-dark/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.3 }}
                      >
                        {workflow.description}
                      </motion.p>
                    )}
                  </CardHeader>
                  
                  <CardContent 
                    className="flex-1 overflow-hidden p-0" 
                    style={{ 
                      height: "calc(100% - 100px)", 
                      position: "relative", 
                      minHeight: "400px" 
                    }}
                  >
                    {workflow ? (
                      <motion.div 
                        className="h-full w-full" 
                        style={{ 
                          position: "absolute", 
                          top: 0, 
                          right: 0, 
                          bottom: 0, 
                          left: 0 
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                      >
                        <ButterflowWorkflowVisualization
                          workflow={{ workflow }}
                          tasks={[]}
                          onNodeSelect={handleNodeSelect}
                        />
                      </motion.div>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-theme-dark/60">No workflow available</p>
                      </div>
                    )}
                  </CardContent>

                  {generatingCode && (
                    <ThinkingIndicator isThinking={generatingCode} text="Generating your application..." />
                  )}
                  
                  <CardFooter className="border-t border-theme-accent-1/10 bg-white/80 p-3">
                    <motion.div 
                      className="flex w-full items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.3 }}
                    >
                      <div className="text-xs text-theme-dark/60">
                        <span className="font-medium text-theme-dark/80">Workflow v{workflow?.version || '1.0'}</span> • 
                        <span className="ml-1">{workflow?.nodes.length || 0} nodes</span>
                      </div>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview Modal */}
          <AnimatePresence>
            {previewVisible && (
              <WorkflowPreview 
                isVisible={previewVisible}
                onClose={() => setPreviewVisible(false)}
                workflowType={getWorkflowPreviewType(workflow)}
              />
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
      {showCodeEditor && selectedNodeCode && (
        <div className="absolute inset-0 z-40">
          <CodeEditor 
            isVisible={showCodeEditor}
            generatedCode={selectedNodeCode}
            projectType={getWorkflowPreviewType(workflow)}
            onClose={() => setShowCodeEditor(false)}
          />
        </div>
      )}
      {showTerminal && (
        <Terminal 
          isVisible={showTerminal}
          onClose={handleCloseTerminal}
          projectType={getWorkflowPreviewType(workflow)}
          isMinimized={isTerminalMinimized}
          onMinimize={handleMinimizeTerminal}
        />
      )}
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowCodeEditor(!showCodeEditor)}
      className="absolute bottom-4 right-4 bg-white/90 shadow-md hover:bg-white"
    >
      {showCodeEditor ? (
        <>
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Workflow
        </>
      ) : (
        <>
          <Code className="mr-1 h-3 w-3" />
          Open Editor
        </>
      )}
    </Button>
      </div>
  );
}


function WorkflowActions({ 
  workflow, 
  onPreview, 
  selectedNodeId,
  selectedNodeCode,
  setShowCodeEditor,
  handleOpenTerminal
}: { 
  workflow: WorkflowType | null, 
  onPreview: () => void,
  selectedNodeId: string | null,
  selectedNodeCode: string | null,
  setShowCodeEditor: (show: boolean) => void,
  handleOpenTerminal: () => void
}) {
  const [copied, setCopied] = useState(false);
  
  if (!workflow) return null;
  
  const handleCopyWorkflow = () => {
    navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownloadWorkflow = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(workflow, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `${workflow.name.toLowerCase().replace(/\s+/g, '-')}-workflow.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8 rounded-md border border-theme-accent-1/50 bg-white shadow-sm hover:bg-theme-accent-1/10"
              onClick={handleCopyWorkflow}
            >
              {copied ? 
                <CheckCheck className="h-4 w-4 text-green-600" /> : 
                <Copy className="h-4 w-4 text-theme-accent-3" />
              }
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">{copied ? 'Copied!' : 'Copy workflow JSON'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8 rounded-md border border-theme-accent-1/50 bg-white shadow-sm hover:bg-theme-accent-1/10"
              onClick={handleDownloadWorkflow}
            >
              <Download className="h-4 w-4 text-theme-accent-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">Download workflow</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8 rounded-md border border-theme-accent-1/50 bg-white shadow-sm hover:bg-theme-accent-1/10"
              onClick={onPreview}
            >
              <Eye className="h-4 w-4 text-theme-accent-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">Preview application</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8 rounded-md border border-theme-accent-1/50 bg-white shadow-sm hover:bg-theme-accent-1/10"
              onClick={() => {
                // Share workflow implementation
                if (navigator.share) {
                  navigator.share({
                    title: workflow.name,
                    text: `Check out my ${workflow.name} workflow!`,
                    url: window.location.href,
                  });
                } else {
                  // Fallback for browsers that don't support navigator.share
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
            >
              <Share className="h-4 w-4 text-theme-accent-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">Share workflow</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8 rounded-md border border-theme-accent-1/50 bg-white shadow-sm hover:bg-theme-accent-1/10"
            onClick={() => {
              // Open code editor with the currently selected node code
              if (selectedNodeId && selectedNodeCode) {
                setShowCodeEditor(true);
              }
            }}
          >
            <Code className="h-4 w-4 text-theme-accent-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">Open Code Editor</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8 rounded-md border border-theme-accent-1/50 bg-white shadow-sm hover:bg-theme-accent-1/10"
            onClick={handleOpenTerminal}
          >
            <TerminalIcon className="text-theme-accent-3 h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">Open Terminal</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    </div>
  );
}
