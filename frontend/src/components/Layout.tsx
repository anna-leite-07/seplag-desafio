import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">Execução Orçamentária</span>

        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:underline">Dashboard</Link>
          <Link to="/orcamentos" className="hover:underline">Orçamentos</Link>

          {token && (
            <button onClick={handleLogout} className="bg-blue-700 hover:bg-blue-800 rounded px-3 py-1 text-sm">Sair</button>
          )}
        </nav>
      </header>

      <main className="flex-1"> <Outlet /> </main>

      <footer className="bg-blue-900 text-white text-center text-sm py-2">
        Desenvolvido por Anna Leite — Desafio Técnico SEPLAG, 2026
      </footer>
    </div>
  );
}