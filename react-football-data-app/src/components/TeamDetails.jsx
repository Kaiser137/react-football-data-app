import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlayers } from '../services/getPlayers';
import { getCoachs } from '../services/getCoachs';
import PlayerCard from '../components/PlayerCard';
import './TeamDetails.css';

export default function TeamDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultSeason = 2023; 


  useEffect(() => {
    const controller = new AbortController();
    async function fetchTeamDetails() {
      try {
        setLoading(true);
        setError(null);

        const [playersData, coachsData] = await Promise.all([
          getPlayers(id, defaultSeason, controller.signal),
          getCoachs(id, controller.signal)
        ]);

        setPlayers(playersData);
        setCoach(coachsData[0]); 
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTeamDetails();

    return () => {
      controller.abort();
    };
  }, [id]);

  return (
    <div className="team-details-container">
      <button onClick={() => navigate(-1)} className="btn-back">
        &larr; Voltar
      </button>

      {loading && <p className="loading-msg">⏳ A recolher os dados do plantel e equipa técnica...</p>}
      {error && <p className="error-msg">⚠️ Erro ao carregar dados: {error}</p>}

      {!loading && !error && (
        <>
          {coach && (
            <div className="coach-section">
              <h3>Treinador Atual</h3>
              <div className="coach-card">
                <img src={coach.foto} alt={coach.nome} style={{ width: '100px', borderRadius: '50%' }} />
                <div>
                  <p><strong>{coach.nome}</strong></p>
                  <p>Nacionalidade: {coach.nacionalidade}</p>
                  <p>Idade: {coach.idade} anos</p>
                </div>
              </div>
            </div>
          )}

          <div className="players-section">
            <h3>Plantel - Época {defaultSeason}</h3>
            <div className="players-grid">
              {players.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}