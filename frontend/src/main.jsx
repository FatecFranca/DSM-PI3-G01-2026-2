import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter} from 'react-router-dom' // liga a navegação por URL

import './index.css'
import App from './App.jsx'
import { CardapioProvider } from './context/CardapioContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <BrowserRouter>
          <CardapioProvider>
            <App />
      </CardapioProvider>
    </BrowserRouter>
  
  </StrictMode>,
)


//O StrictMode protege e analisa tudo o que está dentro dele.
//O BrowserRouter entrega o "superpoder" de ler e mudar as URLs para quem estiver dentro dele 

