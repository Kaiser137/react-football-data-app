import { useState, useEffect } from 'react';
import { getTopPlayers } from '../services/getTopPlayers';
import TopPlayerList from '../components/TopPlayerList';
import './TopScorers.css'; // 🚀 O nosso novo ficheiro de estilos!

export default function TopScorers() {
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchTopScorers() {
      try {
        setLoading(true);
        const data = await getTopPlayers(71, 2023, 'topscorers', abortController.signal);
        setScorers(data);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTopScorers();

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) return <div className="status-container loading-state">⏳ A carregar os artilheiros do campeonato...</div>;
  
  if (error) return <div className="status-container error-state">❌ Ocorreu um erro: {error}</div>;

  return (
    <div className="top-scorers-page">
      <div className="page-header">
        <h2>⚽ Artilheiros - Brasileirão 2023</h2>
        <p>Os melhores marcadores da época</p>
      </div>
      
      <TopPlayerList players={scorers} statType="gols" />
    </div>
  );
}