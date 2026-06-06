import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from "./contexts/LanguageContext";
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/Router.jsx'
import { ToastContainer } from "react-toastify";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>

        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover
          closeOnClick
          theme="light"
        />
      </LanguageProvider>
    </QueryClientProvider>

  </StrictMode>,
)
