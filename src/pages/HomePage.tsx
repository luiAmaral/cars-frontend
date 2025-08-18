// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <h1>Bem-vindo ao Sistema de Gestão de Veículos</h1>
      <p>Selecione uma das opções abaixo para começar:</p>
      <nav className="home-nav">
        <Link to="/marcas" className="nav-button">
          Gerenciar Marcas
        </Link>
        <Link to="/modelos" className="nav-button">
          Gerenciar Modelos
        </Link>
        <Link to="/carros" className="nav-button">
          Gerenciar Carros
        </Link>
      </nav>
    </div>
  );
}

export default HomePage;