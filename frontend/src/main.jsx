import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const matomo = createInstance({
  urlBase: import.meta.env.VITE_MATOMO_URL_BASE,
  siteId: Number(import.meta.env.VITE_MATOMO_SITE_ID || 1),
  trackerUrl: `${import.meta.env.VITE_MATOMO_URL_BASE}/matomo.php`,
  srcUrl: `${import.meta.env.VITE_MATOMO_URL_BASE}/matomo.js`,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MatomoProvider value={matomo}>
      <App />
    </MatomoProvider>
  </StrictMode>,
)
