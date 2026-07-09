import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Orcamentos from '../pages/Orcamentos';
import OrcamentoDetalhe from '../pages/OrcamentoDetalhe';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/orcamentos" element={<Orcamentos />} />
        <Route path="/orcamentos/:id" element={<OrcamentoDetalhe />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}