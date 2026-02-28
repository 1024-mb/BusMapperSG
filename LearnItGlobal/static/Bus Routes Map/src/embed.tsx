import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

// Function to mount the subway map in any div
export function mountSubwayMap(elementId: string = 'subway-map-root') {
  const container = document.getElementById(elementId);
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error(`Element with id "${elementId}" not found`);
  }
}

// Auto-mount if element exists
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mountSubwayMap('subway-map-root');
    });
  } else {
    mountSubwayMap('subway-map-root');
  }
}
