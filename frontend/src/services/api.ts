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

export default api;