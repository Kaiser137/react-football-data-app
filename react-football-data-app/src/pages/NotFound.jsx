import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-icon">⚽❌</div>
      <h1>Fim de Jogo!</h1>
      <p>O árbitro foi ao VAR e confirmou: esta página não existe ou o URL está incorreto.</p>
      
      <Link to="/" className="btn-home">
        Voltar para o Campeonato
      </Link>
    </div>
  );
}