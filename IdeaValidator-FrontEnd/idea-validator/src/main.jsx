import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ConversationProvider } from './context/ConversationContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConversationProvider>
      <App />
    </ConversationProvider>
  </StrictMode>
);
