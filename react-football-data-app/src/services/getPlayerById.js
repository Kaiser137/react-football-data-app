const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

export async function getPlayerById(playerId, season, signal) {
    if (!playerId || !season) {
        throw new Error("⚠️ Parâmetros de jogador e temporada são obrigatórios.");
    }

    const url = `${BASE_URL}/players?id=${playerId}&season=${season}`;

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
        if (!response.ok) throw new Error(`❌ Erro HTTP: ${response.status}`);
        
        const data = await response.json();
        if (data.errors && Object.keys(data.errors).length > 0) {
            throw new Error("❌ Erro da API: " + JSON.stringify(data.errors));
        }
        
        if (!data.response || data.response.length === 0) {
            throw new Error("⚠️ Detalhes do jogador não encontrados na base de dados.");
        }
        
        const item = data.response[0];
        const player = item.player;
        const stats = item.statistics[0]; 

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

    } catch (error) {
        if (error.name === 'AbortError') throw error;
        throw new Error(error.message);
    }
}