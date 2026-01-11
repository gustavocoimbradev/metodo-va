import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/home/page.jsx'
import MentoriaIA from './pages/mentoria/ia/page.jsx'
import MentoriaJovana from './pages/mentoria/gestao-de-escritorio/page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mentoria/inteligencia-artificial" element={<MentoriaIA />} />
        <Route path="/mentoria/gestao-de-escritorio" element={<MentoriaJovana />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
