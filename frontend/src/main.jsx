import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer} from 'react-toastify';
import { CreateContextProvider } from './context/myContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ToastContainer />
    <CreateContextProvider>
    <App />
    </CreateContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
