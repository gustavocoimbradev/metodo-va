import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import MentoriaIA from './MentoriaIA.jsx'
import MentoriaJovana from './MentoriaJovana.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/mentoria/inteligencia-artificial" element={<MentoriaIA />} />
        <Route path="/mentoria/gestao-de-escritorio" element={<MentoriaJovana />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
