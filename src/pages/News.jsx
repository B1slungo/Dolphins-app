import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function News() {
  const [notizie, setNotizie] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function caricaNews() {
      try {
        setLoading(true);
        // Scarichiamo le news mettendo prima quelle importanti e poi le più recenti
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('importante', { ascending: false })
          .order('data_pubblicazione', { ascending: false });

        if (error) throw error;
        if (data) setNotizie(data);
      } catch (error) {
        console.error("Errore nel caricamento delle news:", error.message);
      } finally {
        setLoading(false);
      }
    }

    caricaNews();
  }, []);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Caricamento ultime notizie... 📰</div>;
  }

  return (
    <div className="news-page">
        <div className="news-intro">
        <h2>Dolphins News 📰</h2>
        <p>Rimani sempre aggiornato su eventi, comunicati ufficiali e novità del mondo Dolphins Riccione.</p>
        </div>

      <div className="news-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
        {notizie.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center' }}>Nessuna notizia pubblicata al momento.</p>
        ) : (
          notizie.map((articolo) => {
            // Formattiamo la data in formato italiano (GG/MM/AAAA)
            const dataFormattata = new Date(articolo.data_pubblicazione).toLocaleDateString('it-IT');
            
            return (
              <div key={articolo.id} className={`news-card ${articolo.importante ? 'importante' : ''}`}>
                <div className="news-header">
                  <span className="news-categoria">{articolo.categoria || 'Avviso'}</span>
                  <span className="news-data">📅 {dataFormattata}</span>
                </div>
                
                <h4>{articolo.titolo}</h4>
                <p className="news-contenuto">{articolo.contenuto}</p>
                
                {articolo.importante && (
                  <div className="urgente-badge">⚠️ Comunicazione Importante</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}