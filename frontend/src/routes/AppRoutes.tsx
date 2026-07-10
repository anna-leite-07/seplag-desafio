import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Orcamentos from '../pages/Orcamentos';
import OrcamentoDetalhe from '../pages/OrcamentoDetalhe';
import RotaProtegida from './RotaProtegida';
import Layout from '../components/Layout';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>

          <Route path="/login" element={<Login />} />
          
          <Route element={<RotaProtegida />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orcamentos" element={<Orcamentos />} />
            <Route path="/orcamentos/:id" element={<OrcamentoDetalhe />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}