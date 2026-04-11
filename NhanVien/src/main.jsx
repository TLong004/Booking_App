import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // ✅ thêm dòng này
import './index.css'
import AppRouter from './routes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>       
      <AppRouter />
    </BrowserRouter>
  </StrictMode>,
)