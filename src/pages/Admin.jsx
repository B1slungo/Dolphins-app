import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

// Inserisci qui l'email (o le email) autorizzate ad accedere al pannello
const EMAILS_AUTORIZZATE = ['isaacvillaa4@gmail.com', 'barosi85@libero.it','altrastaff@dolphins.it']; 

export default function Admin() {
  const navigate = useNavigate();
  const [autorizzato, setAutorizzato] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('news'); // 'news' o 'partite'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Stato per il form delle News
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategoria, setNewsCategoria] = useState('Generale');
  const [newsImportante, setNewsImportante] = useState(false);

  // Stato per il form delle Partite
  const [squadraHome, setSquadraHome] = useState('Dolphins Riccione');
  const [squadraGuest, setSquadraGuest] = useState('');
  const [categoriaPartita, setCategoriaPartita] = useState('');
  const [dataPartita, setDataPartita] = useState('');
  const [oraPartita, setOraPartita] = useState('');
  const [luogoPartita, setLuogoPartita] = useState('');

  // CONTROLLO DI SICUREZZA ALL'AVVIO
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && EMAILS_AUTORIZZATE.includes(user.email.toLowerCase())) {
        setAutorizzato(true);
      } else {
        setAutorizzato(false);
        // Opzionale: puoi decommentare la riga sotto se vuoi rispedirli subito alla home
        // navigate('/'); 
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
      const { error } = await supabase
        .from('news')
        .insert([
          {
            titolo: newsTitle,
            contenuto: newsContent,
            categoria: newsCategoria,
            importante: newsImportante,
            data_pubblicazione: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      setMessage('✅ News pubblicata con successo!');
      setNewsTitle('');
      setNewsContent('');
      setNewsCategoria('Generale');
      setNewsImportante(false);
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
            risultato: '' 
          }
        ]);

      if (error) throw error;
      setMessage('✅ Partita inserita nel calendario!');
      setSquadraGuest('');
      setDataPartita('');
      setOraPartita('');
      setCategoriaPartita('');
      setLuogoPartita('');
    } catch (error) {
      setMessage(`❌ Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 1. Schermata di caricamento mentre controlla l'identità
  if (checkingAuth) {
    return (
      <div className="admin-page" style={{ color: 'white', textAlign: 'center', padding: '50px' }}>
        <h3>Verifica autorizzazione in corso... 🛡️</h3>
      </div>
    );
  }

  // 2. Schermata bloccata se l'utente non è tra quelli nell'array
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

  // 3. Pannello di controllo normale se l'utente è autorizzato
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

            <label>Categoria / Destinatari News</label>
            <select value={newsCategoria} onChange={(e) => setNewsCategoria(e.target.value)} required>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
              <input 
                type="checkbox" 
                id="importante"
                checked={newsImportante} 
                onChange={(e) => setNewsImportante(e.target.checked)}
                style={{ width: 'auto', cursor: 'pointer' }}
              />
              <label htmlFor="importante" style={{ cursor: 'pointer', margin: 0, color: '#ef4444', fontWeight: 'bold' }}>
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

        {activeTab === 'partite' && (
          <form onSubmit={handleAddMatch} className="admin-form">
            <label>Squadra in Casa (Home)</label>
            <input type="text" value={squadraHome} onChange={(e) => setSquadraHome(e.target.value)} required />

            <label>Squadra Ospite (Guest)</label>
            <input type="text" placeholder="Es. Basket Rimini" value={squadraGuest} onChange={(e) => setSquadraGuest(e.target.value)} required />

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