import { NavLink } from 'react-router-dom';
import './Header.css'; 

export default function Header() {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>⚽ API-Football App</h1>
      </div>
      
      <nav>
        <ul>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Times
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/classificacao" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Classificação
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/artilheiros" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Artilheiros
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/garcons" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Garçons
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}