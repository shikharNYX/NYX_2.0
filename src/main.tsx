import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { ThemeProvider } from 'next-themes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
