import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Calendario() {
  const [partite, setPartite] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function caricaPartite() {
      try {
        setLoading(true);
        // Scarichiamo tutte le righe dalla tabella 'partite'
        const { data, error } = await supabase
          .from('partite')
          .select('*');

        if (error) throw error;
        if (data) setPartite(data);
      } catch (error) {
        console.error("Errore nel caricamento del calendario:", error.message);
      } finally {
        setLoading(false);
      }
    }

    caricaPartite();
  }, []);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Caricamento match in corso... 🏀</div>;
  }

  return (
    <div className="calendario-page">
      <div className="calendar-intro" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
          <span>Calendario Gare</span>
          <span style={{ display: 'inline-block', lineHeight: '1' }}>🏀</span>
        </h2>
        <p>Resta aggiornato sui match di tutte le categorie dei Dolphins Riccione</p>
      </div>

      <div className="partite-container">
        {partite.length === 0 ? (
          <p style={{ color: '#64748b' }}>Nessuna partita in programma al momento.</p>
        ) : (
          partite.map((partita) => (
            <div key={partita.id} className="partita-card">
              <div className="partita-header">
                <span className="partita-categoria">{partita.categoria}</span>
                <span className="partita-data">
                  {partita.data_ora ? partita.data_ora.replace('T', ' ').substring(0, 16) : ''} </span>
              </div>

              {/* CONTROLLO DINAMICO CON UN UNICO CAMPO RISULTATO (PULITO) */}
              <div className="match-status-or-score">
                {(!partita.risultato || partita.risultato.trim() === '') ? (
                  <div className="match-not-played">
                    Partita ancora non disputata
                  </div>
                ) : (
                  <div className="partita-risultato">
                    {partita.risultato}
                  </div>
                )}

                <div className="match-vs-text">VS</div>
              </div>

              <div className="partita-footer">
                📍 {partita.luogo}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}