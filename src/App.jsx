import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Cadastramento from './Pages/Cadastramento/Cadastramento'
import Perifericos from '../src/Pages/Perifericos/Perifericos'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/computadores" element={<Cadastramento />} />
            <Route path="/perifericos" element={<Perifericos />} />
          </Routes>
        </BrowserRouter>
      </main>
      <Footer />
    </div>
  )
}

export default App
