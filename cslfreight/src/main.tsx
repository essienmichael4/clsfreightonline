import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ReactQueryProvider from './components/ReactQueryProvider.tsx'
import AuthProvider from './context/authContext.tsx'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster richColors position="bottom-right" />
    <BrowserRouter>
      <ReactQueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
