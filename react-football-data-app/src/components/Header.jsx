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
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              end
            >
              Ligas & Times
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}