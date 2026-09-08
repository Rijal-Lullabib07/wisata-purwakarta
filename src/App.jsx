import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Beranda from './pages/Beranda'
import Destinasi from './pages/Destinasi'
import Tentang from './pages/Tentang'
import Kontak from './pages/Kontak'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/destinasi" element={<Destinasi />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/kontak" element={<Kontak />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
