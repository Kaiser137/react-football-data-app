import './TopPlayerList.css';
import { Link } from 'react-router-dom';

export default function TopPlayerList({ players, statType = "gols" }) {
  if (!players || players.length === 0) {
    return <p className="empty-msg">Nenhum jogador encontrado no ranking.</p>;
  }

  return (
    <div className="top-players-grid">
      {players.map((player, index) => (
        <div key={player.id} className="top-player-card">
          
          <div className="ranking-badge">{index + 1}º</div>

          <div className="photo-container">
            <img className="player-photo" src={player.foto} alt={player.nome} />
            {player.escudo && (
              <img className="team-logo" src={player.escudo} alt={player.time} />
            )}
          </div>
          
          <h3>{player.nome}</h3>
          <p className="team-name">{player.time}</p>
          
          <div className="stat-highlight">
            {statType === "gols" ? (
              <span>⚽ Gols: <strong>{player.gols}</strong></span>
            ) : (
              <span>👟 Assistências: <strong>{player.assistencias}</strong></span>
            )}
          </div>

          <Link 
            to={`/jogador/${player.id}`} 
            state={{ teamId: player.teamId }} 
            className="player-link"
          >
            Ver Detalhes
          </Link>

        </div>
      ))}
    </div>
  );
}