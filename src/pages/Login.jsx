import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Campi aggiuntivi per la registrazione dell'atleta
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [categoria, setCategoria] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 1. GESTIONE LOGIN E REGISTRAZIONE
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isRegistering) {
        // REGISTRAZIONE su Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData?.user) {
          // CREA IL PROFILO NELLA TABELLA ATLETI
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
          
          // Login automatico immediato dopo la registrazione
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (loginError) throw loginError;
          
          // Vai alla card
          navigate('/card');
        }
      } else {
        // LOGIN STANDARD
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        navigate('/card');
      }
    } catch (error) {
      setMessage(`Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. GESTIONE LOGOUT
  const handleLogout = async () => {
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMessage('Disconnessione effettuata con successo.');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(`Errore durante il logout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
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
                  background: 'var(--primary-blue)',
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
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" disabled={loading}>
            {loading ? 'Elaborazione...' : isRegistering ? 'Registrati' : 'Accedi'}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <button className="switch-btn" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Hai già un account? Accedi' : 'Nuovo atleta? Registrati qui'}
        </button>

        <button className="btn-secondary" onClick={handleLogout} style={{ marginTop: '20px', width: '100%', borderColor: '#ef4444', color: '#ef4444' }}>
          Disconnetti Account 🚪
        </button>
      </div>
    </div>
  );
}