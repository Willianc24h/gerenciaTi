import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Cadastramento from './Pages/Cadastramento/Cadastramento'
function App() {

  return (
    <>
    <BrowserRouter>
    <Header/>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/gerenciamento" element={<Cadastramento />} />
    </Routes>
    <Footer/>
    </BrowserRouter>

    </>
  )
}

export default App
