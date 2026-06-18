const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

export async function getStandings(leagueId, season, signal) {
    
    if (!leagueId || !season) {
        throw new Error("⚠️ Parâmetros de liga e temporada são obrigatórios.");
    }

    const url = `${BASE_URL}/standings?league=${leagueId}&season=${season}`;

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

        if (!data.response || data.response.length === 0 || !data.response[0].league.standings) {
            throw new Error("⚠️ Nenhuma classificação encontrada para esses parâmetros.");
        }

        const standingsData = data.response[0].league.standings[0];

        const standingsInfo = standingsData.map(item => ({
            posicao: item.rank,
            id: item.team.id,
            nome: item.team.name,
            escudo: item.team.logo,
            pontos: item.points,
            jogos: item.all.played,
            vitorias: item.all.win,
            empates: item.all.draw,
            derrotas: item.all.lose,
            saldoGols: item.goalsDiff,
            forma: item.form
        }));
        
        return standingsInfo;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Integridade mantida: Requisição cancelada pelo AbortController.");
            throw error;
        }
        throw new Error(error.message);
    }
}