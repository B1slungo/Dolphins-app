import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Home() {
  const navigate = useNavigate();
  const [newsImportante, setNewsImportante] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  // Recupera l'avviso importante da Supabase
  useEffect(() => {
    async function caricaNewsInEvidenza() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('importante', true)
          .order('data_pubblicazione', { ascending: false })
          .limit(1);

        if (error) throw error;
        if (data && data.length > 0) {
          setNewsImportante(data[0]);
        }
      } catch (error) {
        console.error("Errore nel caricamento della news in evidenza:", error.message);
      }
    }

    caricaNewsInEvidenza();
  }, []);

  return (
    <div className="home-page">
      
      {/* BOX AVVISO IMPORTANTE IN CIMA */}
      {newsImportante && isAlertVisible && (
        <div className="urgent-alert-box">
          <div className="urgent-alert-header">
            <div className="urgent-alert-badge">
              <span className="bell-ring">🔔</span> COMUNICAZIONE IMPORTANTE
            </div>
            <button 
              className="urgent-close-btn" 
              onClick={() => setIsAlertVisible(false)}
              title="Chiudi avviso"
            >
              ×
            </button>
          </div>
          <div className="urgent-alert-body">
            <h3 className="urgent-alert-title">{newsImportante.titolo}</h3>
            <p className="urgent-alert-text">{newsImportante.contenuto}</p>
          </div>
        </div>
      )}

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

        <div className="feature-card" onClick={() => navigate('/news')}>
          <div className="feature-icon">📰</div>
          <h3>Comunicati & Novità</h3>
          <p>Rimani sempre aggiornato su eventi, comunicati ufficiali e novità del mondo Dolphins Riccione.</p>
        </div>
        </section>

        {/*=============================================== 
           NUOVA SEZIONE: LINK RAPIDI IN FONDO ALLA HOME 
          =============================================== */}
      <section className="quick-links-section">
        <h3 className="quick-links-title">Link Rapidi & Utili</h3>
        <div className="quick-links-container">
          
          {/* Link 1: WhatsApp Segreteria (Sostituisci il numero con quello reale se vuoi) */}
          <a 
            href="https://chat.whatsapp.com/DMtj9JHEy0wClXe31TVa9h?s=cl&p=a&ilr=4&amv=2" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="quick-link-item"
          >
            <span className="quick-link-icon">💬</span>
            <div className="quick-link-text">
              <h4>Scrivi alla Segreteria</h4>
              <p>Entra nel gruppo WhatsApp della Segreteria dei Dolphins per dubbi o domande, Massimo 1 genitore per famiglia.</p>
            </div>
          </a>

          {/* Link 2: Modulo Visita Medica o Iscrizione */}
          <a 
            href="https://www.facebook.com/share/14iBTDHrDuw/"
            target="_blank" 
            rel="noopener noreferrer" 
            className="quick-link-item"
          >
            <span className="quick-link-icon">📘</span>
            <div className="quick-link-text">
              <h4>Facebook Dolphins</h4>
              <p>Seguici per non perderti tutte le novità</p>
            </div>
          </a>

          {/* Link 3: Instagram Ufficiale */}
          <a 
            href="https://www.instagram.com/dolphinsbasketriccione?igsh=Z3lnNjR3aHNtZzN3" // Inserisci il link al vostro profilo
            target="_blank" 
            rel="noopener noreferrer" 
            className="quick-link-item"
          >
            <span className="quick-link-icon">📸</span>
            <div className="quick-link-text">
              <h4>Instagram Dolphins</h4>
              <p>Seguici per foto e storie live</p>
            </div>
          </a>

    </div>
      </section>
    </div>
  );
}