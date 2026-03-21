import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initErrorMonitoring } from './lib/errorMonitoring'
import './index.css'

initErrorMonitoring();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)