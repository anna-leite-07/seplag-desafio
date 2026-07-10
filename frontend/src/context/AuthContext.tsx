import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import type { Usuario } from '../types';

interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    carregando: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(true);

    // Roda uma vez. Quando o app carrega, verifica se já tem token
    useEffect(() => {
        const tokenSalvo = localStorage.getItem('token');
        const usuarioSalvo = localStorage.getItem('usuario');

        if (tokenSalvo && usuarioSalvo) {
            setToken(tokenSalvo);
            setUsuario(JSON.parse(usuarioSalvo));
        }

        setCarregando(false);
    }, []);

    async function login(email: string, password: string) {
        const resposta = await api.post('/auth/login', { email, password });
        const { access_token, user } = resposta.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('usuario', JSON.stringify(user));

        setToken(access_token);
        setUsuario(user);
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
        setUsuario(null);
    }

    return (
        <AuthContext.Provider value={{ usuario, token, login, logout, carregando }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook customizado
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
    }
    return context;
}