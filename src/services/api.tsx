import axios from "axios";
import { message } from "antd";

// Crear una instancia de Axios
const api = axios.create({
  baseURL: "https://practicaswebback.onrender.com", // Base de la API
});

// Interceptor para agregar el token a cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      message.error("Sesión expirada, inicia sesión nuevamente.");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirige al login
    } else {
      message.error(error.response?.data?.intMessage || "Error en la solicitud");
    }
    return Promise.reject(error);
  }
);

export default api; // Exporta la instancia
