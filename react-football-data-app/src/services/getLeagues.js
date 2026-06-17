const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

export async function getLeagues(season, country, signal) {
    const params = new URLSearchParams();
    if (season) params.append('season', season);
    if (country) params.append('country', country);

    const queryString = params.toString();
    const url = `${BASE_URL}/leagues${queryString ? `?${queryString}` : ''}`;

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
            throw new Error("⚠️ Nenhuma liga encontrada com esses filtros.");
        }
        
        const leaguesInfo = data.response.map(item => ({
            id: item.league.id,
            nome: item.league.name,
            tipo: item.league.type, 
            logo: item.league.logo,
            pais: item.country.name,
            bandeiraPais: item.country.flag
        }));
        
        return leaguesInfo;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Integridade mantida: Requisição de ligas cancelada pelo AbortController.");
            throw error;
        }
        throw new Error(error.message);
    }
}