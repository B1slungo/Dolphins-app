import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import SponsorCard from '../components/SponsorCard';

export default function Sponsor() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function caricaSponsor() {
      try {
        setLoading(true);
        // Scarichiamo gli sponsor ordinati per nome
        const { data, error } = await supabase
          .from('sponsor')
          .select('*')
          .order('is_gold', { ascending: false }) //Mette i True (gold) prima dei false
          .order('nome' , { ascending: true }); // ordina poi per nome alfabetico

        if (error) throw error;
        if (data) setSponsors(data);
      } catch (error) {
        console.error("Errore nel caricamento degli sponsor:", error.message);
      } finally {
        setLoading(false);
      }
    }

    caricaSponsor();
  }, []);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Caricamento partner in corso... 🤝</div>;
  }

  return (
    <div className="sponsor-page">
      {/* Titolo aggiornato con la nuova idea del Presidente! */}
      <div className="sponsor-intro" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
          <span>Amici dei Dolphins</span> 
          <span style={{ display: 'inline-block', lineHeight: '1' }}>🤝</span>
        </h2>
        <p>Mostra la tua Card Digitale in queste attività di Riccione per ricevere sconti e vantaggi esclusivi!</p>
      </div>

      <div className="sponsor-grid">
  {sponsors.length === 0 ? (
    <p style={{ color: '#64748b', gridColumn: '1/-1' }}>Nessun partner registrato al momento.</p>
    ) : (
    sponsors.map((singoloSponsor) => (
      <SponsorCard key={singoloSponsor.id} sponsor={singoloSponsor} />
    ))
    )}
      </div>
    </div>
  );
}