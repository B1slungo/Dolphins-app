import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profiloAtleta, setProfiloAtleta] = useState(null);

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Campi aggiuntivi per la registrazione dell'atleta
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [categoria, setCategoria] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // CONTROLLA LO STATO DELL'UTENTE AL CARICAMENTO
  useEffect(() => {
    // 1. Prendi la sessione attuale
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        caricaProfiloAtleta(session.user.id);
      }
    });

    // 2. Ascolta i cambi di stato (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        caricaProfiloAtleta(session.user.id);
      } else {
        setUser(null);
        setProfiloAtleta(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // FUNZIONE PER CARICARE I DATI DELL'ATLETA DAL DB
  const caricaProfiloAtleta = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('atleti')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) setProfiloAtleta(data);
    } catch (error) {
      console.error("Errore caricamento profilo:", error.message);
    }
  };

  // GESTIONE LOGIN E REGISTRAZIONE
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isRegistering) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData?.user) {
          const numeroTesseraCasuale = `DBR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

          const { error: dbError } = await supabase
            .from('atleti')
            .insert([
              {
                id: authData.user.id,
                nome,
                cognome,
                categoria,
                numero_tessera: numeroTesseraCasuale,
              }
            ]);

          if (dbError) throw dbError;

          await supabase.auth.signInWithPassword({ email, password });
          navigate('/card');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/card');
      }
    } catch (error) {
      setMessage(`❌ Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // GESTIONE LOGOUT
  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMessage('Disconnessione effettuata.');
      setEmail('');
      setPassword('');
      setNome('');
      setCognome('');
      setCategoria('');
    } catch (error) {
      setMessage(`Errore durante il logout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        
        {/* VISTA 1: L'UTENTE È GIÀ LOGGATO (MOSTRA IL SUO PROFILO) */}
        {user ? (
          <div className="profile-dashboard">
            <span className="profile-avatar">🐬</span>
            <h2>Bentornato nei Dolphins!</h2>
            
            {profiloAtleta ? (
              <div className="profile-details-card">
                <h3>{profiloAtleta.nome} {profiloAtleta.cognome}</h3>
                <p className="profile-team">🏀 Squadra: <strong>{profiloAtleta.categoria}</strong></p>
                <p className="profile-card-number">🪪 Tessera: <code>{profiloAtleta.numero_tessera}</code></p>
              </div>
            ) : (
              <p>Caricamento dettagli atleta...</p>
            )}

            <p className="profile-email-sub">Account collegato: {user.email}</p>

            <div className="profile-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button className="btn-primary" onClick={() => navigate('/card')} style={{ width: '100%' }}>
                Apri la tua Card Digitale 🪪
              </button>
              
              <button 
                className="btn-secondary" 
                onClick={handleLogout} 
                disabled={loading}
                style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444', background: 'transparent' }}
              >
                {loading ? 'Disconnessione...' : 'Disconnetti Account 🚪'}
              </button>
            </div>
          </div>
        ) : (
          
          /* VISTA 2: L'UTENTE NON È LOGGATO (MOSTRA FORM ACCEDI / REGISTRATI) */
          <>
            <h2>{isRegistering ? 'Diventa un Dolphin 🐬' : 'Accedi alla card'}</h2>
            <p>{isRegistering ? 'Crea il tuo profilo atleta' : 'Inserisci le tue credenziali per vedere la tua Card'}</p>

            <form onSubmit={handleAuth} className="login-form">
              {isRegistering && (
                <>
                  <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                  <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />

                  <label style={{ textAlign: 'left', display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
                    Categoria / Squadra del giocatore
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                    style={{
                      padding: '12px 15px',
                      background: 'var(--primary-blue, #1e293b)',
                      border: '1px solid #3a506b',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '1rem',
                      width: '100%',
                      boxSizing: 'border-box',
                      marginBottom: '10px'
                    }}
                  >
                    <option value="" disabled>Seleziona la squadra del giocatore...</option>
                    <option value="Minibasket">Minibasket 🧸</option>
                    <option value="Esordienti">Esordienti 🏀</option>
                    <option value="Under 13">Under 13 🏀</option>
                    <option value="Under 14">Under 14 🏀</option>
                    <option value="Under 15">Under 15 🏀</option>
                    <option value="Under 17">Under 17 ⚡</option>
                    <option value="Under 19">Under 19 ⚡</option>
                    <option value="Prima Squadra">Prima Squadra 🔥</option>
                    <option value="Staff / Allenatore">Staff / Allenatore 📋</option>
                  </select>
                </>
              )}

              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              
              <div className="password-container" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                >
                  {showPassword ? "👀" : "🔒"}
                </button>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                {loading ? 'Elaborazione...' : isRegistering ? 'Registrati' : 'Accedi'}
              </button>
            </form>

            {message && <p className="auth-message" style={{ marginTop: '15px', color: '#00c6ff' }}>{message}</p>}

            <button className="switch-btn" onClick={() => setIsRegistering(!isRegistering)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }}>
              {isRegistering ? 'Hai già un account? Accedi' : 'Nuovo atleta? Registrati qui'}
            </button>
          </>
        )}

      </div>
    </div>
  );
}