import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

// Change 'root' to whatever ID you want to use
const containerId = 'subway-map-container';

const container = document.getElementById(containerId);
if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}