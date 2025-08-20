import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';

import MarcaListPage from './pages/Marca/MarcaListPage';
import MarcaFormPage from './pages/Marca/MarcaFormPage';
import ModeloListPage from './pages/Modelo/ModeloListPage';
import ModeloFormPage from './pages/Modelo/ModeloFormPage';
import CarroListPage from './pages/Carro/CarroListPage';
import CarroFormPage from './pages/Carro/CarroFormPage';
import './App.css';

function App() {
  return (
    <>
      <header className="main-header">
        <div className="header-content">
          <Link to="/" className="logo">Gestão de Veículos</Link>
        </div>
      </header>
      <main className="container">
        <Routes>
          {/* Rota Principal */}
          <Route path="/" element={<HomePage />} />

          {/* Rotas de Marcas */}
          <Route path="/marcas" element={<MarcaListPage />} />
          <Route path="/marcas/novo" element={<MarcaFormPage />} />
          <Route path="/marcas/editar/:id" element={<MarcaFormPage />} />

          {/* Rotas de Modelos */}
          <Route path="/modelos" element={<ModeloListPage />} />
          <Route path="/modelos/novo" element={<ModeloFormPage />} />
          <Route path="/modelos/editar/:id" element={<ModeloFormPage />} />

          {/* Rotas de Carros */}
          <Route path="/carros" element={<CarroListPage />} />
          <Route path="/carros/novo" element={<CarroFormPage />} />
          <Route path="/carros/editar/:id" element={<CarroFormPage />} />

          

        </Routes>
      </main>
    </>
  );
}

export default App;