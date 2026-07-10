//import React from 'react';
import generaliLogo from '../assets/Generali.png';
import photoSiLogo from '../assets/photoSi.png';
import KadorLogo from '../assets/Kador.png';
import IsokineticLogo from '../assets/Isokinetic.png';
// Dati di esempio per i Top Sponsor (Grandi somme)
const topSponsor = [
  { id: 1, name: "Generali Assicurazioni", logo: generaliLogo, desc: "Main Sponsor Ufficiale" },
  { id: 2, name: "Photo Sì", logo: photoSiLogo, desc: "Main Sponsor Ufficiale" },
  { id: 3, name: "Kador", logo: KadorLogo, desc: "Main Sponsor Ufficiale" },
];

// Dati di esempio per gli Sponsor Convenzionati (Piccoli sponsor con sconti per famiglie)
const localSponsor = [
  { id: 1, name: "Isokinetic", logo: IsokineticLogo, discount: "Sconto 10% sulle pizze d'asporto", address: "Viale Ceccarini, 10" },
  { id: 2, name: "Ottica Riccione", logo: "https://via.placeholder.com/150x80", discount: "Sconto 15% su occhiali da vista e sole", address: "Corso Fratelli Cervi, 45" },
  { id: 3, name: "Gelateria del Mare", logo: "https://via.placeholder.com/150x80", discount: "Panna in omaggio e 10% sulle torte", address: "Viale D'Annunzio, 22" },
];

export default function Sponsor() {
  return (
    <div className="sponsor-page">
      <div className="sponsor-intro">
        <h2>I Nostri Partner</h2>
        <p>Ringraziamo tutte le realtà che sostengono il progetto Dolphins Basket Riccione e offrono vantaggi esclusivi alle nostre famiglie.</p>
      </div>

      {/* SEZIONE 1: TOP SPONSOR */}
      <section className="sponsor-section top-tier">
        <div className="section-title-wrapper">
          <span className="emoji-badge">🏆</span>
          <h3>Top Sponsor & Main Partner</h3>
        </div>
        <div className="sponsor-grid">
          {topSponsor.map(sponsor => (
            <div key={sponsor.id} className="sponsor-card gold">
              <img src={sponsor.logo} alt={sponsor.name} className="header-logo" />
              <h4>{sponsor.name}</h4>
              <p>{sponsor.desc}</p>
            </div>
            
          ))}
        </div>
      </section>

      {/* SEZIONE 2: SPONSOR LOCALI / CONVENZIONI */}
      <section className="sponsor-section local-tier">
        <div className="section-title-wrapper">
          <span className="emoji-badge">🤝</span>
          <h3>Sponsor Convenzionati & Sconti Famiglie</h3>
        </div>
        <p className="section-subtitle">Mostra la tua Card Dolphins in queste attività per ricevere lo sconto dedicato!</p>
        
        <div className="sponsor-grid">
          {localSponsor.map(sponsor => (
            <div key={sponsor.id} className="sponsor-card local">
              <img src={sponsor.logo} alt={sponsor.name} className="header-logo" />
              <h4>{sponsor.name}</h4>
              <div className="discount-tag">{sponsor.discount}</div>
              <span className="sponsor-address">📍 {sponsor.address}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}