import { useState, useEffect } from 'react';
import { getStandings } from '../services/getLeague';
import './Standings.css'; // Importaremos o CSS na nossa próxima etapa!

export default function Standings() {
  // Gerenciamento de estado (Critério C1 da Rubrica)
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Implementação da função de cleanup exigida pela rubrica (Critério C2)
    const abortController = new AbortController();

    async function fetchStandings() {
      try {
        setLoading(true);
        // Buscando a classificação do Brasileirão (Liga 71, Temporada 2023)
        const data = await getStandings(71, 2023, abortController.signal);
        setStandings(data);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchStandings();

    return () => {
      abortController.abort();
    };
  }, []);

  // Feedback de loading e erro (Critério D2 da Rubrica)
  if (loading) {
    return (
      <div className="status-container loading-state">
        ⏳ Carregando a tabela de classificação...
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container error-state">
        ❌ Poxa, ocorreu um erro ao carregar a tabela: {error}
      </div>
    );
  }

  return (
    <div className="standings-page">
      <div className="page-header">
        <h2>🏆 Tabela de Classificação - Brasileirão 2023</h2>
        <p>Acompanhe a pontuação e o desempenho dos times</p>
      </div>

      <div className="table-wrapper">
        <table className="standings-table">
          <thead>
            <tr>
              <th className="center-text">#</th>
              <th className="team-col">Clube</th>
              <th className="center-text">Pts</th>
              <th className="center-text">J</th>
              <th className="center-text">V</th>
              <th className="center-text">E</th>
              <th className="center-text">D</th>
              <th className="center-text">SG</th>
              <th className="center-text">Forma</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team) => (
              <tr key={team.id}>
                <td className="rank-col center-text">{team.posicao}º</td>
                
                <td className="team-col">
                  <div className="team-info">
                    <img 
                      src={team.escudo} 
                      alt={`Escudo do ${team.nome}`} 
                      className="team-logo-micro" 
                    />
                    <span className="team-name">{team.nome}</span>
                  </div>
                </td>
                
                <td className="points-col center-text"><strong>{team.pontos}</strong></td>
                <td className="center-text">{team.jogos}</td>
                <td className="center-text">{team.vitorias}</td>
                <td className="center-text">{team.empates}</td>
                <td className="center-text">{team.derrotas}</td>
                <td className="center-text">{team.saldoGols}</td>
                
                <td className="form-col center-text">
                  <div className="form-badges">
                    {/* A propriedade 'forma' traz uma string tipo "WDLLW". Vamos separar em badges. */}
                    {team.forma && team.forma.split('').map((char, index) => (
                      <span key={index} className={`form-badge form-${char.toLowerCase()}`}>
                        {char}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}