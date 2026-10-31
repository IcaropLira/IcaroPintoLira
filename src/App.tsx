import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ConquistaPage from './pages/ConquistaPage';
import ConquistasHub from './pages/ConquistasHub';
import ProjectPage from './pages/ProjectPage';

function NotFound() {
  return <div className="w proj"><h1>404</h1><p><Link to="/">Voltar ao início</Link></p></div>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projetos/:slug" element={<ProjectPage />} />
        <Route path="conquistas" element={<ConquistasHub />} />
        <Route path="conquistas/:slug" element={<ConquistaPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
