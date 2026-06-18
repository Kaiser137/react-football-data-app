const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

export async function getTopPlayers(leagueId, season, type = 'topscorers', signal) {
    if (!leagueId || !season) {
        throw new Error("⚠️ Parâmetros de liga e temporada são obrigatórios.");
    }

    const url = `${BASE_URL}/players/${type}?league=${leagueId}&season=${season}`;

    const options = {
        method: 'GET',
        headers: {
            'x-apisports-key': API_KEY, 
            'Accept': 'application/json'
        },
        signal 
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
            throw new Error(`⚠️ Nenhum dado encontrado para ${type}.`);
        }
        
        const playersInfo = data.response.map(item => ({
            id: item.player.id,
            nome: item.player.name,
            foto: item.player.photo,
            time: item.statistics[0]?.team?.name || "Desconhecido",
            escudo: item.statistics[0]?.team?.logo,
            teamId: item.statistics[0].team.id,
            gols: item.statistics[0]?.goals?.total || 0,
            assistencias: item.statistics[0]?.goals?.assists || 0,
            rating: item.statistics[0]?.games?.rating || "N/A"
        }));
        
        return playersInfo;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Requisição de Top Players cancelada.");
            throw error;
        }
        throw new Error(error.message);
    }
}