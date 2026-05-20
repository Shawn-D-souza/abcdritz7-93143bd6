// --- POLYFILL FOR REACT-SNAP (Older Chromium) ---
if (!(Object as any).hasOwn) {
  (Object as any).hasOwn = function (obj: any, prop: any) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}
// ------------------------------------------------

import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import posthog from 'posthog-js';

// Initialize PostHog analytics
posthog.init('phc_Cwzp2wTjZu6DMBP7aCT9WecdZ7YZmr2cuQ5u7PS5Mz3Y', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
});

const rootElement = document.getElementById('root') as HTMLElement;

// Check if the HTML is already pre-rendered by react-snap
if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Fallback for normal SPA behavior during local development
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
