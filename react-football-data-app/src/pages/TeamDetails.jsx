import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // 👈 1. Adicionado o Link aqui!
import { getPlayers } from '../services/getPlayers';
import { getCoachs } from '../services/getCoachs';
import './TeamDetails.css';

export default function TeamDetails() {
  const { id } = useParams(); // 👈 Esse 'id' é o id do time!
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDetails() {
      try {
        setLoading(true);
        setError(null);
        const [playersData, coachsData] = await Promise.all([
          getPlayers(id, "2023", controller.signal),
          getCoachs(id, controller.signal)
        ]);

        const nomesOrdenados = playersData.sort((a, b) => a.nome.localeCompare(b.nome));
        setPlayers(nomesOrdenados);
        setCoach(coachsData[0]);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();

    return () => controller.abort();
  }, [id]);

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)} className="btn-back">← Voltar para Times</button>

      {loading && <p className="status-msg">⏳ Carregando ficha técnica e elenco...</p>}
      {error && <p className="error-msg">⚠️ Erro: {error}</p>}

      {!loading && !error && (
        <div className="details-wrapper">
          {coach && (
            <div className="coach-block">
              <h2>Comissão Técnica</h2>
              <div className="coach-details-card">
                <img src={coach.foto} alt={coach.nome} />
                <div>
                  <h3>{coach.nome}</h3>
                  <p><strong>Idade:</strong> {coach.idade} anos</p>
                  <p><strong>Nacionalidade:</strong> {coach.nacionalidade}</p>
                  
                  {/* 👈 2 e 3. Corrigido para coach.id e teamId: id */}
                  <Link to={`/treinador/${coach.id}`} state={{ teamId: id }} className="coach-link">
                    Ver Detalhes do técnico
                  </Link>
                </div>
              </div>
            </div>
          )}

          <h2>Jogadores Inscritos</h2>
          <div className="players-list-grid">
            {players.map(player => (
              <div key={player.id} className="player-detail-card">
                <img src={player.foto} alt={player.nome} />
                <h4>{player.nome}</h4>
                <p>Posição: {player.posicao}</p>
                <p>Idade: {player.idade} anos</p>
                <p>⚽ Gols: {player.gols}</p>
                
                {/* 👈 4. Corrigido teamId: id aqui também */}
                <Link to={`/jogador/${player.id}`} state={{ teamId: id }} className="player-link">
                  Ver Detalhes do Jogador
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}