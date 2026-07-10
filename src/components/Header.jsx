import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.jpeg'; // Importiamo il logo dei Dolphins

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-brand">
        <img src={logo} alt="logo.jpeg" className="header-logo" />
        <h1>Dolphins Riccione</h1>
      </div>
      
      <nav className="header-nav">
        <ul>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active-link' : ''}>🏠 Home</NavLink></li>
          <li><NavLink to="/card" className={({ isActive }) => isActive ? 'active-link' : ''}>💳 La mia Card</NavLink></li>
          <li><NavLink to="/sponsor" className={({ isActive }) => isActive ? 'active-link' : ''}>🏆 Sponsor</NavLink></li>
          <li><NavLink to="/calendar" className={({ isActive }) => isActive ? 'active-link' : ''}>📅 Calendario</NavLink></li>
          <li><NavLink to="/news" className={({ isActive }) => isActive ? 'active-link' : ''}>📰 News</NavLink></li>
          <li><NavLink to="/login" className={({ isActive }) => isActive ? 'active-link' : ''}>👤 Profilo</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}