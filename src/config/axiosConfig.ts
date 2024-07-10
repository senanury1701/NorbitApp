import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: "https://backend.norbit.com.tr/",
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  const token = sessionStorage.getItem('accessToken');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = token ? `token ${token}` : '';
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('userAuth');
      sessionStorage.removeItem('accessToken');
      const navigate = useNavigate();
      navigate('/login');
    } else {
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
