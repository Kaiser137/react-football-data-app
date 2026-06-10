// 1. Importe o hook useEffect do React
import { useEffect } from 'react';
// 2. Importe a sua função (ajuste o caminho da pasta conforme a sua estrutura)
import { getTeams } from './services/getTeams'; 

function App() {

  // O useEffect com um array de dependências vazio [] 
  // garante que esse código rode APENAS UMA VEZ quando a página carregar.
  useEffect(() => {
    
    // Criamos uma função assíncrona interna para poder usar o await
    async function testarAPI() {
      try {
        // Chamamos a sua função!
        const times = await getTeams(71, 2024); 
        
        // Vamos dar um log AQUI NO FRONTEND apenas para confirmar se os dados chegaram
        console.log("🏆 Dados que chegaram no React:", times); 
      } catch (error) {
        console.error("❌ Deu ruim no teste:", error.message);
      }
    }

    testarAPI();

  }, []); // <-- Atenção ao array vazio aqui!

  return (
    <div>
      <h1>Testando a API-Football ⚽</h1>
      <p>Abra o console do navegador (Aperte F12) e veja se os times apareceram!</p>
    </div>
  );
}

export default App;