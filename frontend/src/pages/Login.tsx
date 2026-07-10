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
    <div className="bg-gray-50 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-gray-900"> Painel de Execução Orçamentária </h1>

        <div>
          <label className="block text-sm text-gray-600 mb-1">E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded px-3 py-2 w-full" required />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="border rounded px-3 py-2 w-full" required />
        </div>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <button type="submit" disabled={enviando} className="bg-blue-600 text-white rounded px-4 py-2 w-full disabled:opacity-50">
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}