import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import { initErrorMonitoring } from './lib/errorMonitoring'
import { initAnalytics } from './lib/analytics'
import './index.css'

// Initialize observability before rendering
initErrorMonitoring();
initAnalytics();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
