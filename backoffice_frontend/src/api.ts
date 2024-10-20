import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000'

// Cria a instância do Axios fora do useEffect
const api = axios.create({
  baseURL: backendUrl, // Defina a URL base da API
});

// Hook customizado que encapsula a lógica do interceptor com `useNavigate`
const useAxios = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Intercepta as respostas da API
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 ||error.response.status === 403) ) {
          console.log('Erro de autorização');
          
          // Remove o token do storage e redireciona para a página de login
          localStorage.removeItem('token');
          navigate('/'); // Redireciona para a página de login
        }
        return Promise.reject(error);
      }
    );

    // Limpa o interceptor ao desmontar o componente para evitar memory leaks
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return api; // Retorna a instância do Axios
};

const observerErr = window.console.error;
window.console.error = (...args) => {
  if (args[0].includes('ResizeObserver')) {
    return;
  }
  observerErr(...args);
};

export default useAxios;
