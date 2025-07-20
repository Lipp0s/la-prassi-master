import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Performance optimizations
const root = ReactDOM.createRoot(document.getElementById('root'));

// Strict mode for development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Preload critical resources
const preloadCriticalResources = () => {
  const criticalImages = [
    // Add critical image URLs here
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Execute preloading
preloadCriticalResources(); 