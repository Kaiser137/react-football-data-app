import './PlayerCard.css';

export default function PlayerCard({ player }) {
  return (
    <div className="player-card">
      <img src={player.foto} alt={`Foto de ${player.nome}`} />
      <h4>{player.nome}</h4>
      <p><strong>Posição:</strong> {player.posicao}</p>
      <p><strong>Idade:</strong> {player.idade} anos</p>
      <p><strong>Golos:</strong> {player.gols}</p>
    </div>
  );
}