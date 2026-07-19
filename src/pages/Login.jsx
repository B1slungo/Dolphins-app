import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

// Inserisci qui le email abilitate ad accedere al pannello di controllo
const ADMIN_EMAILS = [
  'isaacvillaa4@gmail.com', 
  'barosi85@libero.it'
];

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profiloAtleta, setProfiloAtleta] = useState(null);

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [categoria, setCategoria] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Stati per gestire l'evento di installazione PWA (Punto 2)
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        caricaProfiloAtleta(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        caricaProfiloAtleta(session.user.id);
      } else {
        setUser(null);
        setProfiloAtleta(null);
      }
    });

    // Ascolta l'evento prima che il browser mostri il prompt automatico
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

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

  // Funzione per attivare l'installazione PWA al click del bottone
  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Risultato installazione: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  const isAdmin = user && ADMIN_EMAILS.includes(user.email?.toLowerCase());

  return (
    <div className="login-page">
      <div className="login-box">
        
        {/* VISTA A: UTENTE LOGGATO */}
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

            <div className="profile-actions">
              <button className="btn-primary" onClick={() => navigate('/card')}>
                Apri la tua Card Digitale 🪪
              </button>
              
              {isAdmin && (
                <button className="btn-admin" onClick={() => navigate('/admin')}>
                  Pannello Admin 🛠️
                </button>
              )}
              
              <button className="btn-secondary" onClick={handleLogout} disabled={loading}>
                {loading ? 'Disconnessione...' : 'Disconnetti Account 🚪'}
              </button>
            </div>
          </div>
        ) : (
          
          /* VISTA B: FORM ACCEDI / REGISTRATI */
          <>
            <h2>{isRegistering ? 'Diventa un Dolphin 🐬' : 'Accedi alla card'}</h2>
            <p>{isRegistering ? 'Crea il tuo profilo atleta' : 'Inserisci le tue credenziali per vedere la tua Card'}</p>

            {/* BOTTONE DI INSTALLAZIONE PWA (Punto 2) */}
            {showInstallBtn && (
              <button 
                onClick={handleInstallApp}
                style={{
                  background: 'var(--accent-cyan)',
                  color: 'var(--primary-blue)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                📲 Installa l'App dei Dolphins!
              </button>
            )}

            {/* MESSAGGIO INFORMATIVO PER I GENITORI */}
            {isRegistering && (
              <div className="register-alert-box">
                ⚠️ <strong>Attenzione Genitori:</strong> Registrate l'account inserendo il <strong>Nome e Cognome del figlio</strong> tesserato, non il vostro. Servirà per generare correttamente la sua tessera digitale.
              </div>
            )}

            <form onSubmit={handleAuth} className="login-form">
              {isRegistering && (
                <>
                  <input type="text" placeholder="Nome atleta" value={nome} onChange={(e) => setNome(e.target.value)} required />
                  <input type="text" placeholder="Cognome atleta" value={cognome} onChange={(e) => setCognome(e.target.value)} required />

                  <label style={{ textAlign: 'left', display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
                    Categoria / Squadra del giocatore
                  </label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
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
              
              <div className="password-container">
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

              <button type="submit" disabled={loading}>
                {loading ? 'Elaborazione...' : isRegistering ? 'Registrati' : 'Accedi'}
              </button>
            </form>

            {message && <p className="auth-message">{message}</p>}

            <button className="switch-btn" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? 'Hai già un account? Accedi' : 'Nuovo atleta? Registrati qui'}
            </button>
          </>
        )}

      </div>
    </div>
  );
}