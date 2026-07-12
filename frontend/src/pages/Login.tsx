import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);

    try {
      await login(email, senha);
      navigate('/');
    } catch (err) {
      setErro('E-mail ou senha inválidos.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-300 w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">LOGIN</h1>
          <p className="text-sm text-zinc-500 mt-1">Entre com suas credenciais para continuar</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">E-mail</label>
          <input name="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('campo-senha')?.focus(); } }}
            className="border border-zinc-400 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            required />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Senha</label>
          <input id="campo-senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
            className="border border-zinc-400 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            required />
        </div>

        {erro && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erro}</p>}

        <button type="submit" disabled={enviando}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2.5 w-full text-sm font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors">
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}