import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from 'react-helmet-async';
import { SEOProvider } from './context/SEOContext';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <SEOProvider>
        <BrowserRouter>
          <App />
          <Toaster position="top-right" toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }} />
        </BrowserRouter>
      </SEOProvider>
    </HelmetProvider>
  </StrictMode>
);
