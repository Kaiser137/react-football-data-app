import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>❌ 404 - Página Não Encontrada</h1>
      <p>Ups! O árbitro apitou o fim do jogo para este URL. Esta página não existe.</p>
      <Link to="/" style={{ textDecoration: 'underline', color: 'blue' }}>
        Voltar para a página inicial
      </Link>
    </div>
  );
}