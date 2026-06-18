const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

export async function getPlayers(teamId, season, signal, league = 71) {
    if (!teamId || !season) {
        throw new Error("⚠️ Parâmetros de time (teamId) e temporada (season) são obrigatórios.");
    }

    const url = `${BASE_URL}/players?team=${teamId}&league=${league}&season=${season}`;

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
            throw new Error("⚠️ Nenhum jogador encontrado para este time e temporada.");
        }
        
        const playersInfo = data.response.map(item => {
            const player = item.player;
            
            const stats = item.statistics.find(s => s.team.id === parseInt(teamId)) || item.statistics[0];

            return {
                id: player.id,
                nome: player.name,
                idade: player.age,
                nacionalidade: player.nationality,
                altura: player.height || "Não informada",
                peso: player.weight || "Não informado",
                foto: player.photo,
                posicao: stats?.games?.position || "Não informada",
                rating: stats?.games?.rating || "Sem nota",
                jogos: stats?.games?.appearences || 0,
                minutosJogados: stats?.games?.minutes || 0,
                gols: stats?.goals?.total || 0,
                assistencias: stats?.goals?.assists || 0,
                passesPrecisos: stats?.passes?.accuracy || "0%",
                chutesNoGol: stats?.shots?.on || 0,
                cartoesAmarelos: stats?.cards?.yellow || 0,
                cartoesVermelhos: stats?.cards?.red || 0
            };
        });
        
        return playersInfo;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Integridade mantida: Requisição de jogadores cancelada pelo AbortController.");
            throw error;
        }
        throw new Error(error.message);
    }
}