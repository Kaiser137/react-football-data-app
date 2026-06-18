import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTeams } from '../services/getTeams';
import './Teams.css';

export default function Teams() {
  const { leagueId } = useParams(); 
  const navigate = useNavigate();
  
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTeamsData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTeams(leagueId, "2023", controller.signal);
        setTeams(data);
        setFilteredTeams(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTeamsData();

    return () => controller.abort();
  }, [leagueId]);

  useEffect(() => {
    const results = teams.filter(team =>
      team.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeams(results);
  }, [searchTerm, teams]);

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)} className="btn-back">← Voltar pras Ligas</button>
      
      <h2>⚽ Times nesta Competição</h2>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Filtrar time por nome..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className="status-msg">⏳ Carregando times do campeonato...</p>}
      {error && <p className="error-msg">⚠️ Erro: {error}</p>}

      {!loading && !error && (
        <div className="teams-grid">
          {filteredTeams.map(team => (
            <div key={team.id} className="team-card">
              <img src={team.escudo} alt={team.nome} />
              <h3>{team.nome}</h3>
              <p>Estádio: {team.estadio}</p>
              <p>Cidade: {team.cidadeEstadio}</p>
              <Link to={`/time/${team.id}`} state={{ teamId: team.id }} className="btn-link">Ver Elenco</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}