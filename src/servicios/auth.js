import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Asegúrate que coincide con tu puerto del backend

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Error en login:', error.response?.data || error.message);
    throw error;
  }
};

export const getUsuarioActual = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuario-actual`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    throw error;
  }
};