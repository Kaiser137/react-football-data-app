import './DetailsView.css';

export default function DetailsView({ data }) {
  if (!data) return <p className="loading-msg">Carregando dados da API...</p>;

  const infoKeys = Object.keys(data).filter(key => key !== 'foto' && key !== 'nome');

  return (
    <div className="details-container">
      <div className="details-header">
        <img src={data.foto} alt={data.nome} className="details-photo" />
        <h1>{data.nome}</h1>
      </div>

      <div className="details-grid">
        {infoKeys.map((key) => (
          <div key={key} className="detail-card">
            <span className="detail-label">{key.toUpperCase()}</span>
            <strong className="detail-value">{data[key] || 'N/A'}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}