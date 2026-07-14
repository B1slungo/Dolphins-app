import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Calendario() {
  const [partite, setPartite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSelezionata, setCategoriaSelezionata] = useState('Tutte');

  // Lista delle categorie per il menu a tendina
  const categorieFiltro = [
    'Tutte',
    'Minibasket',
    'Esordienti',
    'Under 13',
    'Under 14',
    'Under 15',
    'Under 17',
    'Under 19',
    'Prima Squadra'
  ];

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
    return <div className="calendario-loading">Caricamento match in corso... 🏀</div>;
  }

  // Filtraggio delle partite in base alla selezione della tendina
  const partiteFiltrate = categoriaSelezionata === 'Tutte'
    ? partite
    : partite.filter(p => p.categoria === categoriaSelezionata);

  return (
    <div className="calendario-page">
      <div className="calendar-intro">
        <h2 className="calendar-title">
          <span>Calendario Gare</span>
          <span className="calendar-title-emoji">🏀</span>
        </h2>
        <p className="calendar-subtitle">Resta aggiornato sui match di tutte le categorie dei Dolphins Riccione</p>
      </div>

      {/* FILTRO CON MENU A TENDINA */}
      <div className="filter-select-container">
        <label htmlFor="categoria-filter" className="filter-select-label">Seleziona Squadra:</label>
        <select
          id="categoria-filter"
          className="filter-select"
          value={categoriaSelezionata}
          onChange={(e) => setCategoriaSelezionata(e.target.value)}
        >
          {categorieFiltro.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'Tutte' ? '🌍 Mostra tutte le squadre' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* LISTA DELLE PARTITE FILTRATE */}
      <div className="partite-container">
        {partiteFiltrate.length === 0 ? (
          <p className="no-matches">
            {categoriaSelezionata === 'Tutte' 
              ? 'Nessuna partita in programma al momento.' 
              : `Nessuna partita in programma per la categoria ${categoriaSelezionata}.`}
          </p>
        ) : (
          partiteFiltrate.map((partita) => (
            <div key={partita.id} className="partita-card">
              <div className="partita-header">
                <span className="partita-categoria">{partita.categoria}</span>
                <span className="partita-data">
                  {partita.data_ora ? partita.data_ora.replace('T', ' ').substring(0, 16) : ''}
                </span>
              </div>

              <div className="partita-teams-line">
                <span className="partita-team team-home">
                  {partita.squadra_home}
                </span>

                <div className="match-status-or-score">
                  {(!partita.risultato || partita.risultato.trim() === '') ? (
                    <div className="match-not-played">
                      Partita non disputata
                    </div>
                  ) : (
                    <div className="partita-risultato">
                      {partita.risultato}
                    </div>
                  )}
                  <div className="match-vs-text">VS</div>
                </div>

                <span className="partita-team team-guest">
                  {partita.squadra_guest}
                </span>
              </div>

              {partita.luogo && (
                <div className="partita-footer">
                  📍 {partita.luogo}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}