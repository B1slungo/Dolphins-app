import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../supabaseClient'; // Importiamo il client di Supabase

export default function Card() {
  const [atleta, setAtleta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function caricaDatiAtleta() {
    try {
      setLoading(true);
      
      // 1. Chiediamo a Supabase chi è l'utente attualmente loggato
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        // Se non c'è nessun utente loggato, rimandiamo alla pagina di login
        console.log("Nessun utente loggato");
        setLoading(false);
        return;
      }

      // 2. Usiamo l'ID dell'utente loggato per scaricare i dati della sua tessera
      let { data, error: dbError } = await supabase
        .from('atleti')
        .select('*')
        .eq('id', user.id) // ID dinamico!
        .maybeSingle();

      if (dbError) throw dbError;
      
      if (data) {
        setAtleta(data);
      }
    } catch (error) {
      console.error("Errore nel caricamento:", error.message);
    } finally {
      setLoading(false);
    }
  }

  caricaDatiAtleta();
}, []);

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Caricamento tessera digitale...</div>;
  }

  if (!atleta) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Nessuna tessera trovata per questo utente.</div>;
  }

  return (
    <div className="card-page">
      <div className="card-intro">
        <h2>La mia Card Digitale</h2>
        <p>Mostra questa tessera nei punti vendita convenzionati per ricevere istantaneamente i tuoi sconti dedicati.</p>
      </div>

      <div className="card-container">
        <div className="dolphins-digital-card">
          <div className="card-overlay"></div>
          
          <div className="card-header-tessera">
            <div className="card-brand-info">
              <img src={logo} alt="logo" className="card-logo-img" />
              <div>
                <h3>DOLPHINS RICCIONE</h3>
                <span>Scuola Basket Academy</span>
              </div>
            </div>
            <span className="card-badge-status">MEMBRO ATTIVO</span>
          </div>

          <div className="card-body-tessera">
            <div className="data-group">
              <label>TESSERATO</label>
              <div className="data-value">{atleta.nome.toUpperCase()} {atleta.cognome.toUpperCase()}</div>
            </div>

            <div className="card-row-double">
              <div className="data-group">
                <label>CATEGORIA</label>
                <div className="data-value-small">{atleta.categoria}</div>
              </div>
              <div className="data-group">
                <label>SCADENZA</label>
                <div className="data-value-small">{atleta.scadenza}</div>
              </div>
            </div>
          </div>

          <div className="card-footer-tessera">
            <div className="tessera-number">
              <label>NUMERO TESSERA</label>
              <span>{atleta.numero_tessera}</span>
            </div>
            
            <div className="real-qrcode-container">
              <QRCodeSVG 
                value={atleta.numero_tessera}
                size={45}
                bgColor={"#ffffff"}
                fgColor={"#0b132b"}
                level={"H"}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card-instructions">
        <p>⚠️ La tessera è strettamente personale e non cedibile a terzi.</p>
      </div>
    </div>
  );
}