import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Sponsor() {
  const [sponsor, setSponsor] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function caricaSponsor() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('sponsor')
          .select('*');

        if (error) throw error;
        if (data) setSponsor(data);
      } catch (error) {
        console.error("Errore nel caricamento degli sponsor:", error.message);
      } finally {
        setLoading(false);
      }
    }

    caricaSponsor();
  }, []);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Caricamento partner... 🤝</div>;
  }

  // Filtro degli sponsor in base alla categoria
  const sponsorGold = sponsor.filter(s => s.is_gold === true || s.is_gold === 'true' || s.is_gold === 1);
  const sponsorStandard = sponsor.filter(s => !s.is_gold || s.is_gold === false || s.is_gold === 'false' || s.is_gold === 0);

  return (
    <div className="sponsor-page">
      {/* INTRODUZIONE GENERALE DELLA PAGINA */}
      <div className="sponsor-intro" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
          <span>I Nostri Partner</span>
          <span style={{ display: 'inline-block', lineHeight: '1' }}>🐬</span>
        </h2>
        <p>Mostra la tua Card Digitale in queste attività di Riccione per ricevere sconti e vantaggi esclusivi!</p>
      </div>

      {/* ================= SEZIONE MAIN SPONSOR ================= */}
      <div className="sponsor-section" style={{ marginBottom: '50px' }}>
        <div className="section-title-wrapper">
          <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-block', lineHeight: '1' }}>⭐</span>
            <span>Main Sponsor</span>
          </h3>
        </div>
        <p className="section-subtitle">I partner principali che sostengono il progetto Dolphins con massima energia.</p>
      </div>

      <div className="sponsor-grid">
        {sponsorGold.length === 0 ? (
          <p style={{ color: '#64748b', gridColumn: '1/-1' }}>Nessun main sponsor presente.</p>
        ) : (
          sponsorGold.map((s) => (
            <div key={s.id} className="sponsor-card gold">
              <div className="sponsor-logo-container">
                {s.logo_url ? (
                  <img src={s.logo_url} alt={s.nome} className="sponsor-logo-img" />
                ) : (
                  <span className="sponsor-default-emoji">🏢</span>
                )}
              </div>
              <h4>{s.nome}</h4>
              {s.sconto && <div className="discount-tag">{s.sconto}</div>}
              {s.descrizione && <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '10px 0' }}>{s.descrizione}</p>}
              
              {/* INDIRIZZO O SITO WEB CLICCABILE PER SPONSOR GOLD */}
              {s.indirizzo && (
                <span className="sponsor-address">
                  {s.indirizzo.startsWith('http') ? '🌐 ' : '📍 '}
                  <a
                    href={
                      s.indirizzo.startsWith('http')
                        ? s.indirizzo
                        : `http://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.indirizzo + ' Riccione')}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="maps-link"
                  >
                    {s.indirizzo.startsWith('http') ? 'Visita il sito web' : s.indirizzo}
                  </a>
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* ================= SEZIONE AMICI DEI DOLPHINS ================= */}
      <div className="sponsor-section">
        <div className="section-title-wrapper">
          <h3 style={{ marginTop: '55px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-block', lineHeight: '1' }}>💙</span>
            <span>Amici dei Dolphins</span>
          </h3>
        </div>
        <p className="section-subtitle">Le attività del territorio che offrono vantaggi esclusivi ai nostri tesserati.</p>
      </div>

      <div className="sponsor-grid">
        {sponsorStandard.length === 0 ? (
          <p style={{ color: '#64748b', gridColumn: '1/-1' }}>Nessun partner standard presente.</p>
        ) : (
          sponsorStandard.map((s) => (
            <div key={s.id} className="sponsor-card">
              <div className="sponsor-logo-container">
                {s.logo_url ? (
                  <img src={s.logo_url} alt={s.nome} className="sponsor-logo-img" />
                ) : (
                  <span className="sponsor-default-emoji">🏢</span>
                )}
              </div>
              <h4>{s.nome}</h4>
              {s.sconto && <div className="discount-tag">{s.sconto}</div>}
              {s.descrizione && <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '10px 0' }}>{s.descrizione}</p>}
              
              {/* INDIRIZZO O SITO WEB CLICCABILE PER SPONSOR STANDARD */}
              {s.indirizzo && (
                <span className="sponsor-address">
                  {s.indirizzo.startsWith('http') ? '🌐 ' : '📍 '}
                  <a
                    href={
                      s.indirizzo.startsWith('http')
                        ? s.indirizzo
                        : `http://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.indirizzo + ' Riccione')}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="maps-link"
                  >
                    {s.indirizzo.startsWith('http') ? 'Visita il sito web' : s.indirizzo}
                  </a>
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}