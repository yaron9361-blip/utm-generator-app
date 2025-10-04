import axios from 'axios';

// Базовый URL для API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Создаём экземпляр axios с настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 секунд
});

// Генерация UTM-метки
export const generateUtm = async (data) => {
  try {
    const response = await api.post('/api/utm/generate', data);
    return response.data;
  } catch (error) {
    console.error('Error generating UTM:', error);
    throw error;
  }
};

// Валидация URL
export const validateUrl = async (url) => {
  try {
    const response = await api.post('/api/utm/validate', { url });
    return response.data;
  } catch (error) {
    console.error('Error validating URL:', error);
    throw error;
  }
};

// Проверка здоровья API
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

export default api;