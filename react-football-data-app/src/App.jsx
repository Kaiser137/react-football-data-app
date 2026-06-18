import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Teams from './pages/Teams';
import TeamDetails from './pages/TeamDetails';
import NotFound from './pages/NotFound';
import Details from './pages/Details';
import TopScorers from './pages/TopScorers';
import TopAssists from './pages/TopAssists';
import Standings from './pages/Standings';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ padding: '20px', minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/liga/:leagueId" element={<Teams />} />

          <Route path="/time/:id" element={<TeamDetails />} />

          <Route path="/jogador/:id" element={<Details entityType="player" />} />

          <Route path="/treinador/:id" element={<Details entityType="coach" />} />

          <Route path="/classificacao" element={<Standings />} />

          <Route path="/artilheiros" element={<TopScorers />} />
          
          <Route path="/garcons" element={<TopAssists />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;