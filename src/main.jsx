import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/home/page.jsx'
import MentoriaIA from './pages/inteligencia-artificial/page.jsx'
import MentoriaJovana from './pages/gestao-de-escritorio/page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inteligencia-artificial" element={<MentoriaIA />} />
        <Route path="/gestao-de-escritorio" element={<MentoriaJovana />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
