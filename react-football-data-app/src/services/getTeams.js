const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

export async function getTeams(leagueId, season, signal) {
    
    if (!leagueId || !season) {
        throw new Error("⚠️ Parâmetros de liga e temporada são obrigatórios.");
    }

    const url = `${BASE_URL}/teams?league=${leagueId}&season=${season}`;

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
            throw new Error("⚠️ Nenhum time encontrado para esses parâmetros.");
        }
        
        const teamsInfo = data.response.map(item => ({
            id: item.team.id,
            nome: item.team.name,
            pais: item.team.country,
            fundacao: item.team.founded,
            escudo: item.team.logo,
            estadio: item.venue.name,
            capacidadeEstadio: item.venue.capacity,
            cidadeEstadio: item.venue.city
        }));
        
        return teamsInfo;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Integridade mantida: Requisição cancelada pelo AbortController.");
            throw error;
        }
        throw new Error(error.message);
    }
}