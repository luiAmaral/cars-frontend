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

      {/* Grid de Features */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🏷️</div>
          <h3 className="feature-title">Gerenciar Marcas</h3>
          <p className="feature-description">
            Cadastre e organize todas as marcas de veículos da sua frota. 
            Mantenha um controle completo sobre os fabricantes.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🚗</div>
          <h3 className="feature-title">Controle de Modelos</h3>
          <p className="feature-description">
            Registre modelos específicos para cada marca, incluindo 
            informações detalhadas e valores de referência FIPE.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔧</div>
          <h3 className="feature-title">Gestão de Carros</h3>
          <p className="feature-description">
            Cadastre veículos individuais com todas as especificações: 
            ano, cor, combustível, portas e muito mais.
          </p>
        </div>
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