import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RotaProtegida() {
  const { token, carregando } = useAuth();

  if (carregando) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}