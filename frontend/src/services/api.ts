import axios from 'axios';

// Cria uma instância do axios para chamar a API
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Roda antes de toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepta toda resposta de erro
api.interceptors.response.use(
  (response) => response, // se deu certo, passa direto
  (error) => {
    // Se der 401 (não autorizado)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;