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

// Only use hydrateRoot in production when react-snap has pre-rendered the HTML.
// During local dev (import.meta.env.DEV), always use createRoot to avoid
// hydration mismatch errors when state changes (e.g. opening dialogs).
if (import.meta.env.PROD && rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
