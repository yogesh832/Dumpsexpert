import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from 'react-helmet-async';
import { SEOProvider } from './context/SEOContext';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <SEOProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SEOProvider>
    </HelmetProvider>
  </StrictMode>
);
