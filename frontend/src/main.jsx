import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const urlBase = import.meta.env.VITE_MATOMO_URL_BASE
const siteId = Number(import.meta.env.VITE_MATOMO_SITE_ID || 1)
let matomo = null
if (urlBase && typeof urlBase === 'string' && urlBase.startsWith('http')) {
  matomo = createInstance({
    urlBase,
    siteId,
    trackerUrl: `${urlBase}/matomo.php`,
    srcUrl: `${urlBase}/matomo.js`,
  })
} else {
  console.warn('Matomo disabled: VITE_MATOMO_URL_BASE is missing or invalid')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {matomo ? (
      <MatomoProvider value={matomo}>
        <App />
      </MatomoProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
