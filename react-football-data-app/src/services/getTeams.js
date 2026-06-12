const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

import { season, leagueId } from '../util/utils'
const temporada = season;
const IdLiga = leagueId;

/**
 * @param {AbortSignal} signal
 */

export async function getTeams(IdLiga, temporada) {
    const url = `${BASE_URL}/teams?league=${IdLiga}&season=${temporada}`;

    const options = {
        method: 'GET',
        headers: {
            'x-apisports-key': API_KEY, 
            'Accept': 'application/json'
        }
        signal: signal
    };

    try {        
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
            throw new Error("❌ Erro retornado pela API: " + JSON.stringify(data.errors));
        }

        if (data.response.length === 0) {
            throw new Error("⚠️ Nenhum time encontrado para esses parâmetros.");
        }
        
        const teamsInfo = data.response.map(item => {
            return {
                id: item.team.id,
                nome: item.team.name,
                pais: item.team.country,
                fundacao: item.team.founded,
                escudo: item.team.logo,
                estadio: item.venue.name,
                capacidadeEstadio: item.venue.capacity,
                cidadeEstadio: item.venue.city
            };
        });
        
        return teamsInfo;

    } catch (error) {
       throw new Error("❌ Erro ao fazer a requisição: " + error.message);
    }
}