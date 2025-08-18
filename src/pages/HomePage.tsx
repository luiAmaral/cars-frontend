// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      {/* Elementos flutuantes decorativos */}
      <div className="floating-elements">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>

      {/* Seção Hero */}
      <div className="hero-section">
        <h1 className="hero-title">
          Sistema de Gestão de Veículos
        </h1>
        <p className="hero-subtitle">
          Gerencie sua frota de veículos de forma inteligente e eficiente. 
          Controle marcas, modelos e carros em uma plataforma moderna e intuitiva.
        </p>
      </div>

      

      {/* Call to Action */}
      <div className="cta-section">
        <h2 className="cta-title">Comece a gerenciar agora</h2>
        <nav className="home-nav">
          <Link to="/marcas" className="nav-button">
            <span className="nav-button-icon">🏷️</span>
            Gerenciar Marcas
          </Link>
          <Link to="/modelos" className="nav-button">
            <span className="nav-button-icon">🚗</span>
            Gerenciar Modelos
          </Link>
          <Link to="/carros" className="nav-button">
            <span className="nav-button-icon">🔧</span>
            Gerenciar Carros
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default HomePage;