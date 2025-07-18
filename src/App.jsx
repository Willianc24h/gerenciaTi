import Footer from './Components/Footer/Footer';
import Header from './Components/Header/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Cadastramento from './Pages/Cadastramento/Cadastramento';
import Perifericos from './Pages/Perifericos/Perifericos';
import Tarefas from './Pages/Tarefas/Tarefas';
import NovoUsuario from './Pages/NovoUsuario/NovoUsuario';
import { SearchProvider } from '../src/services/SearchContext';


function App() {
  return (
    <SearchProvider> {/* Envolvendo a aplicação com o SearchProvider */}
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/computadores" element={<Cadastramento />} />
              <Route path="/usuario" element={<NovoUsuario />} />
              {/* <Route path="/perifericos" element={<Perifericos />} /> */}
              {/* <Route path="/tarefas" element={<Tarefas />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;
