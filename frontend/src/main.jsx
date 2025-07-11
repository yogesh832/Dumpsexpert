import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { SEOProvider } from "./context/SEOContext";
import { Toaster } from "react-hot-toast";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <SEOProvider>
        <PayPalScriptProvider
          options={{
            "client-id":
              "ATxhPLd31jwqQkBasQOAUcxZKJhWBYoopQ4yH1kcsxso8mg-mSO05_n_UGNS9epAVdfelwmGzSyl8UV_", // 🔁 Replace with your actual PayPal Client ID
            currency: "INR",
          }}
        >
          <BrowserRouter>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  style: {
                    background: "#22c55e",
                  },
                },
                error: {
                  style: {
                    background: "#ef4444",
                  },
                },
              }}
            />
          </BrowserRouter>
        </PayPalScriptProvider>
      </SEOProvider>
    </HelmetProvider>
  </StrictMode>
);
