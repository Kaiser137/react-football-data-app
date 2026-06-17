const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

export async function getPlayers(teamId, season, signal) {
    // 1. Validação de segurança
    if (!teamId || !season) {
        throw new Error("⚠️ Parâmetros de time (teamId) e temporada (season) são obrigatórios.");
    }

    const url = `${BASE_URL}/players?team=${teamId}&season=${season}`;

    const options = {
        method: 'GET',
        headers: {
            'x-apisports-key': API_KEY, 
            'Accept': 'application/json'
        },
        signal // Preparado para o cleanup do useEffect
    };

    try {        
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
            throw new Error("❌ Erro retornado pela API: " + JSON.stringify(data.errors));
        }

        if (!data.response || data.response.length === 0) {
            throw new Error("⚠️ Nenhum jogador encontrado para este time e temporada.");
        }
        
        const playersInfo = data.response.map(item => ({
            id: item.player.id,
            nome: item.player.name,
            idade: item.player.age,
            nacionalidade: item.player.nationality,
            foto: item.player.photo,
            posicao: item.statistics[0]?.games?.position || "Não informada",
            gols: item.statistics[0]?.goals?.total || 0
        }));
        
        return playersInfo;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Integridade mantida: Requisição de jogadores cancelada pelo AbortController.");
            throw error;
        }
        throw new Error(error.message);
    }
}