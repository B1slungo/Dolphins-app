import React from 'react';

export default function SponsorCard({ sponsor }) {
  return (
    <div className={`sponsor-card ${sponsor.is_gold ? 'gold' : ''}`}>
      <div className="sponsor-logo-container">
        {sponsor.logo_url ? (
          <img
            src={sponsor.logo_url}
            alt={`Logo ${sponsor.nome}`}
            className="sponsor-logo-img"
          />
        ) : (
          <span className="sponsor-default-emoji">🤝</span>
        )}
      </div>
      <h4>{sponsor.nome}</h4>
      <div className="discount-tag">{sponsor.sconto}</div>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '10px 0' }}>
        {sponsor.descrizione}
      </p>
      <span className="sponsor-address">📍 {sponsor.indirizzo}</span>
    </div>
  );
}