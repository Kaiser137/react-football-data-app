import { useState, useEffect } from 'react';
import { getTopPlayers } from '../services/getTopPlayers';
import TopPlayerList from '../components/TopPlayerList';
import './TopAssists.css';

export default function TopAssists() {
  const [assistsData, setAssistsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchTopAssists() {
      try {
        setLoading(true);
        const data = await getTopPlayers(71, 2023, 'topassists', abortController.signal);
        setAssistsData(data);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTopAssists();

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) return <div className="status-container loading-state">⏳ A carregar os garçons do campeonato...</div>;
  
  if (error) return <div className="status-container error-state">❌ Ocorreu um erro: {error}</div>;

  return (
    <div className="top-assists-page">
      <div className="page-header">
        <h2>⚽ Garçons - Brasileirão 2023</h2>
        <p>Os melhores assistentes da época</p>
      </div>
      
      <TopPlayerList players={assistsData} statType="assistencias" />
    </div>
  );
}