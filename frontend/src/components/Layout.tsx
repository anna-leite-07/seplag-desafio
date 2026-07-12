import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  function handleLogout() {
    logout();
    setMenuAberto(false);
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 border-b border-indigo-700 px-6 py-4 flex items-center justify-between relative sticky top-0 z-20">
        <span className="font-bold text-lg text-white">Execução Orçamentária</span>

        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link to="/" className="text-indigo-100 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/orcamentos" className="text-indigo-100 hover:text-white transition-colors">Orçamentos</Link>

          {token && (
            <button onClick={handleLogout} className="bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg px-4 py-2 text-sm cursor-pointer transition-colors">
              Sair
            </button>
          )}
        </nav>

        <button onClick={() => setMenuAberto(!menuAberto)} className="sm:hidden text-white cursor-pointer" aria-label="Abrir menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuAberto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {menuAberto && (
          <nav className="sm:hidden absolute top-full left-0 w-full bg-indigo-600 border-b border-indigo-700 flex flex-col items-start px-6 py-4 gap-3 shadow-lg z-10">
            <Link to="/" onClick={() => setMenuAberto(false)} className="text-indigo-100 hover:text-white">Início</Link>
            <Link to="/orcamentos" onClick={() => setMenuAberto(false)} className="text-indigo-100 hover:text-white">Orçamentos</Link>

            {token && (
              <button onClick={handleLogout} className="bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg px-4 py-2 text-sm w-full text-left cursor-pointer">
                Sair
              </button>
            )}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-blue-900 text-white text-center text-sm py-2">
        Desafio Técnico SEPLAG, 2026
      </footer>
    </div>
  );
}