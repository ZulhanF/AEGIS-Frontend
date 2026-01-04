import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { initWebVitals } from './utils/webVitals'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Defer Web Vitals to reduce TBT (Total Blocking Time)
if (import.meta.env.PROD) {
  // Delay initialization until after first paint
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initWebVitals());
  } else {
    setTimeout(() => initWebVitals(), 1000);
  }
}
