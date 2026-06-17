const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

export async function getCoachs(teamId, signal) {
    // 1. Validação de segurança
    if (!teamId) {
        throw new Error("⚠️ O parâmetro de time (teamId) é obrigatório para buscar o treinador.");
    }

    const url = `${BASE_URL}/coachs?team=${teamId}`;

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
            throw new Error("⚠️ Nenhum treinador encontrado para este time.");
        }
        
        const coachsInfo = data.response.map(item => ({
            id: item.id,
            nome: item.name,
            primeiroNome: item.firstname,
            sobrenome: item.lastname,
            idade: item.age,
            nacionalidade: item.nationality,
            foto: item.photo,
            timeAtual: item.team ? item.team.name : "Sem clube"
        }));
        
        return coachsInfo;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Integridade mantida: Requisição de treinador cancelada pelo AbortController.");
            throw error;
        }
        throw new Error(error.message);
    }
}