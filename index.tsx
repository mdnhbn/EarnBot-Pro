import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🏁 EarnBot Pro: Main Entry Point (index.tsx) Loaded');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("❌ Critical: Root element not found in DOM");
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);