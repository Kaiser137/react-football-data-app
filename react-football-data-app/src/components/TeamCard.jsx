import { Link } from 'react-router-dom';
import './TeamCard.css'; 

export default function TeamCard({ team }) {
  return (
    <div className="team-card">
      <img src={team.escudo} alt={`Escudo do ${team.nome}`} />
      <h3>{team.nome}</h3>
      <p>Fundação: {team.fundacao}</p>
    
      <Link to={`/time/${team.id}`} className="btn-details">
        Ver Detalhes
      </Link>
    </div>
  );
}