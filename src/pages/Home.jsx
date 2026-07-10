import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Sezione di Benvenuto principale */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Dolphins Riccione Basket 🐬</span>
          <h2>La famiglia dei Dolphins sul tuo Smartphone</h2>
          <p>
            Accedi per mostrare la tua tessera digitale ai partner ufficiali, 
            scopri gli sconti dedicati e resta aggiornato sulla stagione.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/card')}>
              Mostra la tua Card 🪪
            </button>
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Accedi / Registrati 👤
            </button>
          </div>
        </div>
      </section>

      {/* Griglia delle Funzionalità */}
      <section className="features-section">
        <div className="feature-card" onClick={() => navigate('/card')}>
          <div className="feature-icon">🪪</div>
          <h3>Tessera Digitale</h3>
          <p>Il tuo pass personale con QR Code sempre in tasca per usufruire delle convenzioni.</p>
        </div>

        <div className="feature-card" onClick={() => navigate('/sponsor')}>
          <div className="feature-icon">🛍️</div>
          <h3>Sponsor & Sconti</h3>
          <p>Dai un'occhiata alle attività di Riccione convenzionate e risparmia sulla spesa sportiva.</p>
        </div>

        <div className="feature-card" onClick={() => navigate('/calendar')}>
          <div className="feature-icon">🏀</div>
          <h3>Calendario Gare</h3>
          <p>Controlla quando giocano le nostre squadre, dagli Aquilotti fino alla Prima Squadra.</p>
        </div>
      </section>
    </div>
  );
}