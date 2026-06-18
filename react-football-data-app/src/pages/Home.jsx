import { useState, useEffect } from 'react';
import { getTeams } from '../services/getTeams';
import TeamCard from '../components/TeamCard';
import './Home.css'; 

export default function Home() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const defaultLeagueId = 71; 
  const defaultSeason = 2023;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchInitialData() {
      try {
        setLoading(true);
        setError(null);
      
        const data = await getTeams(defaultLeagueId, defaultSeason, controller.signal);
        const timesOrdenados = data.sort((a, b) => a.nome.localeCompare(b.nome));
        setTeams(timesOrdenados);
        setFilteredTeams(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();

    return () => {
      controller.abort();
    };
  }, []); 

  useEffect(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const results = teams.filter(team => 
      team.nome.toLowerCase().includes(lowerCaseSearch)
    );
    setFilteredTeams(results);
  }, [searchTerm, teams]);

  return (
    <div className="home-container">
      <h2>🏆 Brasileirão Série A - 2023</h2>
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Busque um time pelo nome..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className="loading-msg">⏳ Carregando os times, guenta aí...</p>}
      {error && <p className="error-msg">⚠️ Deu ruim: {error}</p>}

      {!loading && !error && (
        <div className="teams-grid">
          {filteredTeams.length > 0 ? (
            filteredTeams.map(team => (
              <TeamCard key={team.id} team={team} />
            ))
          ) : (
            <p>Nenhum time encontrado com esse nome.</p>
          )}
        </div>
      )}
    </div>
  );
}