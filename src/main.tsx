import React from 'react'
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx'
import { Toaster } from "./components/ui/sonner.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster position="top-center"  />
    <App />
  </React.StrictMode>,
)
