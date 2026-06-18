import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DetailsView from '../components/DetailsView';
import { getPlayerById } from '../services/getPlayerById';
import { getCoachs } from '../services/getCoachs';

export default function Details({ entityType }) {
    const { id } = useParams();
    const location = useLocation();
    const teamId = location.state?.teamId; 
    
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchData() {
            if (!teamId) {
                setError("Erro: Informações do time não encontradas. Volte para a página inicial.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                let data;
                let selectedEntity;

                if (entityType === 'player') {
                    selectedEntity = await getPlayerById(id, 2023, signal);
                } else {
                    data = await getCoachs(teamId, signal);
                    selectedEntity = data.find(c => c.id === parseInt(id));
                }

                if (selectedEntity) {
                    setInfo(selectedEntity);
                } else {
                    throw new Error("Não encontramos os detalhes desta pessoa.");
                }
                setError(null);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError("Erro: " + err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        return () => {
            controller.abort();
        };
    }, [id, entityType, teamId]);

    if (loading) return <div className="loading-msg">⏳ Buscando detalhes...</div>;
    if (error) return <div className="error-msg">❌ {error}</div>;

    return (
        <div className="details-page">
            <DetailsView data={info} />
        </div>
    );
}