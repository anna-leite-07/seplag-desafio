import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Orcamentos from '../pages/Orcamentos';
import OrcamentoDetalhe from '../pages/OrcamentoDetalhe';
import RotaProtegida from './RotaProtegida';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<RotaProtegida />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orcamentos" element={<Orcamentos />} />
          <Route path="/orcamentos/:id" element={<OrcamentoDetalhe />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}