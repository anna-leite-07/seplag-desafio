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
      <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between relative">
        <span className="font-bold text-lg">Execução Orçamentária</span>
        
        <nav className="hidden sm:flex items-center gap-4">
          <Link to="/" className="hover:underline">Dashboard</Link>
          <Link to="/orcamentos" className="hover:underline">Orçamentos</Link>

          {token && (
            <button onClick={handleLogout} className="bg-blue-700 hover:bg-blue-800 rounded px-3 py-1 text-sm cursor-pointer">
              Sair
            </button>
          )}
        </nav>

        {/* Botão hambúrguer mobile */}
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="sm:hidden cursor-pointer" aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuAberto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Menu suspenso mobile */}
        {menuAberto && (
          <nav className="sm:hidden absolute top-full left-0 w-full bg-blue-600 flex flex-col items-start px-6 py-4 gap-3 shadow-lg z-10">
            <Link to="/" onClick={() => setMenuAberto(false)} className="hover:underline">
              Início
            </Link>
            <Link to="/orcamentos" onClick={() => setMenuAberto(false)} className="hover:underline">
              Orçamentos
            </Link>

            {token && (
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 rounded px-3 py-1 text-sm w-full text-left cursor-pointer"
              >
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