import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import './index.css';

const isGitHubPagesPath = window.location.pathname === '/Smartcity' || window.location.pathname.startsWith('/Smartcity/');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={isGitHubPagesPath ? '/Smartcity' : undefined}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
