import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

// Inserisci qui l'email (o le email) autorizzate ad accedere al pannello
const EMAILS_AUTORIZZATE = ['isaacvillaa4@gmail.com', 'barosi85@libero.it', 'altrastaff@dolphins.it']; 

export default function Admin() {
  const navigate = useNavigate();
  const [autorizzato, setAutorizzato] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('news'); // 'news' o 'partite'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Stato per il form delle News (Aggiornato con Categoria + Destinatari separati e Data_Ora)
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategoria, setNewsCategoria] = useState(''); // Campo TEXT libero
  const [newsDestinatari, setNewsDestinatari] = useState('Generale'); // La SELECT dei destinatari
  const [newsImportante, setNewsImportante] = useState(false);
  const [newsDataPubblicazione, setNewsDataPubblicazione] = useState(''); // Data e Ora manuale

  // Stato per il form delle Partite (Aggiunto il campo Risultato)
  const [squadraHome, setSquadraHome] = useState('Dolphins Riccione');
  const [squadraGuest, setSquadraGuest] = useState('');
  const [categoriaPartita, setCategoriaPartita] = useState('');
  const [dataPartita, setDataPartita] = useState('');
  const [oraPartita, setOraPartita] = useState('');
  const [luogoPartita, setLuogoPartita] = useState('');
  const [risultatoPartita, setRisultatoPartita] = useState(''); // Nuovo campo di testo

  // CONTROLLO DI SICUREZZA ALL'AVVIO
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && EMAILS_AUTORIZZATE.includes(user.email.toLowerCase())) {
        setAutorizzato(true);
      } else {
        setAutorizzato(false);
      }
      setCheckingAuth(false);
    };

    checkUser();
  }, [navigate]);

  // Aggiunta Nuova News
  const handleAddNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Se non viene specificata una data manuale, usiamo il timestamp corrente
      const dataFinale = newsDataPubblicazione 
        ? new Date(newsDataPubblicazione).toISOString() 
        : new Date().toISOString();

      const { error } = await supabase
        .from('news')
        .insert([
          {
            titolo: newsTitle,
            contenuto: newsContent,
            categoria: newsCategoria, // Salva la stringa libera
            destinatari: newsDestinatari, // Opzionale: se hai questa colonna, altrimenti lo salva dove desideri
            importante: newsImportante,
            data_pubblicazione: dataFinale
          }
        ]);

      if (error) throw error;
      setMessage('✅ News pubblicata con successo!');
      setNewsTitle('');
      setNewsContent('');
      setNewsCategoria('');
      setNewsDestinatari('Generale');
      setNewsImportante(false);
      setNewsDataPubblicazione('');
    } catch (error) {
      setMessage(`❌ Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Aggiunta Nuova Partita
  const handleAddMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const dataOraCombinata = `${dataPartita}T${oraPartita}:00`;

      const { error } = await supabase
        .from('partite')
        .insert([
          {
            squadra_home: squadraHome,
            squadra_guest: squadraGuest,
            categoria: categoriaPartita,
            data_ora: dataOraCombinata,
            luogo: luogoPartita,
            risultato: risultatoPartita // Inserisce il testo digitato (o stringa vuota)
          }
        ]);

      if (error) throw error;
      setMessage('✅ Partita inserita nel calendario!');
      setSquadraGuest('');
      setDataPartita('');
      setOraPartita('');
      setCategoriaPartita('');
      setLuogoPartita('');
      setRisultatoPartita('');
    } catch (error) {
      setMessage(`❌ Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="admin-page" style={{ color: 'white', textAlign: 'center', padding: '50px' }}>
        <h3>Verifica autorizzazione in corso... 🛡️</h3>
      </div>
    );
  }

  if (!autorizzato) {
    return (
      <div className="admin-page">
        <div className="admin-box" style={{ textAlign: 'center', borderColor: '#ef4444' }}>
          <h2 style={{ color: '#ef4444' }}>Accesso Negato 🚫</h2>
          <p style={{ margin: '20px 0', color: '#94a3b8' }}>
            Non hai i permessi amministrativi per accedere a questa pagina.
          </p>
          <button className="tab-btn" onClick={() => navigate('/')} style={{ background: '#2d3d54', color: 'white' }}>
            Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-box">
        <h2>Pannello di Controllo 📋</h2>
        <p>Aggiungi contenuti in tempo reale sull'applicazione</p>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => { setActiveTab('news'); setMessage(''); }}
          >
            📰 Nuova News
          </button>
          <button 
            className={`tab-btn ${activeTab === 'partite' ? 'active' : ''}`}
            onClick={() => { setActiveTab('partite'); setMessage(''); }}
          >
            🏀 Nuova Partita
          </button>
        </div>

        {message && <p className="admin-message">{message}</p>}

        {/* FORM NEWS */}
        {activeTab === 'news' && (
          <form onSubmit={handleAddNews} className="admin-form">
            <label>Titolo della News</label>
            <input 
              type="text" 
              placeholder="Inserisci il titolo..." 
              value={newsTitle} 
              onChange={(e) => setNewsTitle(e.target.value)} 
              required 
            />

            <div className="form-row">
              <div>
                <label>Categoria (Tag)</label>
                <input 
                  type="text" 
                  placeholder="Es. Eventi, Comunicato, Avviso..." 
                  value={newsCategoria} 
                  onChange={(e) => setNewsCategoria(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label>Destinatari (Filtro)</label>
                <select value={newsDestinatari} onChange={(e) => setNewsDestinatari(e.target.value)} required>
                  <option value="Generale">Generale (Tutti) 🌍</option>
                  <option value="Minibasket">Minibasket 🧸</option>
                  <option value="Esordienti">Esordienti 🏀</option>
                  <option value="Under 13">Under 13 🏀</option>
                  <option value="Under 14">Under 14 🏀</option>
                  <option value="Under 15">Under 15 🏀</option>
                  <option value="Under 17">Under 17 ⚡</option>
                  <option value="Under 19">Under 19 ⚡</option>
                  <option value="Prima Squadra">Prima Squadra 🔥</option>
                  <option value="Sostenitori">Sostenitori / Soci 💙</option>
                </select>
              </div>
            </div>

            <label>Data e Ora Pubblicazione</label>
            <input 
              type="datetime-local" 
              value={newsDataPubblicazione} 
              onChange={(e) => setNewsDataPubblicazione(e.target.value)} 
            />

            <div className="admin-checkbox-wrapper">
              <input 
                type="checkbox" 
                id="importante"
                checked={newsImportante} 
                onChange={(e) => setNewsImportante(e.target.checked)}
              />
              <label htmlFor="importante">
                ⚠️ Comunicazione Importante / In Evidenza
              </label>
            </div>

            <label>Contenuto</label>
            <textarea 
              placeholder="Scrivi il testo della news qui..." 
              value={newsContent} 
              onChange={(e) => setNewsContent(e.target.value)} 
              rows="6"
              required 
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Pubblicazione...' : 'Pubblica News 🚀'}
            </button>
          </form>
        )}

        {/* FORM PARTITE */}
        {activeTab === 'partite' && (
          <form onSubmit={handleAddMatch} className="admin-form">
            <label>Squadra in Casa (Home)</label>
            <input type="text" value={squadraHome} onChange={(e) => setSquadraHome(e.target.value)} required />

            <label>Squadra Ospite (Guest)</label>
            <input type="text" placeholder="Es. Basket Rimini" value={squadraGuest} onChange={(e) => setSquadraGuest(e.target.value)} required />

            <div className="form-row">
              <div>
                <label>Categoria della gara</label>
                <select value={categoriaPartita} onChange={(e) => setCategoriaPartita(e.target.value)} required>
                  <option value="" disabled>Seleziona squadra...</option>
                  <option value="Minibasket">Minibasket 🧸</option>
                  <option value="Esordienti">Esordienti 🏀</option>
                  <option value="Under 13">Under 13 🏀</option>
                  <option value="Under 14">Under 14 🏀</option>
                  <option value="Under 15">Under 15 🏀</option>
                  <option value="Under 17">Under 17 ⚡</option>
                  <option value="Under 19">Under 19 ⚡</option>
                  <option value="Prima Squadra">Prima Squadra 🔥</option>
                </select>
              </div>
              <div>
                <label>Risultato (Opzionale)</label>
                <input 
                  type="text" 
                  placeholder="Es. 72 - 68 per Dolphins" 
                  value={risultatoPartita} 
                  onChange={(e) => setRisultatoPartita(e.target.value)} 
                />
              </div>
            </div>

            <label>Luogo della partita</label>
            <input type="text" placeholder="Es. Palestra Fontanelle, Riccione" value={luogoPartita} onChange={(e) => setLuogoPartita(e.target.value)} required />

            <div className="form-row">
              <div>
                <label>Data</label>
                <input type="date" value={dataPartita} onChange={(e) => setDataPartita(e.target.value)} required />
              </div>
              <div>
                <label>Ora</label>
                <input type="time" value={oraPartita} onChange={(e) => setOraPartita(e.target.value)} required />
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Inserimento...' : 'Inserisci Partita 📅'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}