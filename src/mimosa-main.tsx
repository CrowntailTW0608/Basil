import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import MimosaApp from './MimosaApp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MimosaApp />
  </StrictMode>,
);
