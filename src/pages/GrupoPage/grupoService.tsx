/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { message } from "antd";


const API_URL = "https://practicaswebback.onrender.com";

const getToken = () => localStorage.getItem("token");


export const obtenerGrupos = async () => {
  const token = getToken();
  if (!token) throw new Error("Token no encontrado");
  return axios.get(`${API_URL}/get_grupos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const obtenerMisGrupos = async () => {
  const token = getToken();
  if (!token) throw new Error("Token no encontrado");
  return axios.get(`${API_URL}/get_mis_grupos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const crearGrupo = async (groupName: string) => {
  const token = getToken();

  if (!token) {
    message.error("Token no encontrado");
    throw new Error("Token no encontrado");
  }

  try {

    const hide = message.loading("Creando grupo...", 0);

    const response = await axios.post<{
      message: string; data: { data: string }
}>(
      `${API_URL}/create_group`,
      { name: groupName },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    hide();

    if (response.status === 201) {
      message.success("Grupo creado exitosamente");
      return response.data.data;
    } else {
      message.error(response.data.message || "Error al crear grupo");
      throw new Error(response.data.message || "Error al crear grupo");
    }
  } catch (error: any) {
    message.error(error.response?.data?.intMessage || "Error en el servidor");
    throw new Error(error.response?.data?.intMessage || "Error en el servidor");
  }
};


export const eliminarGrupo = async (idGrupo: string, token: string | null) => {
  if (!token) throw new Error("Token no disponible");

  try {
    const response = await axios.delete(`${API_URL}/delete_grupo/${idGrupo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    message.error("Error eliminando grupo");
    console.error("Error eliminando grupo:", error);
    throw error;
  }
};


export const obtenerUsuarios = async () => {
  const token = getToken();
  if (!token) throw new Error("Token no encontrado");
  return axios.get(`${API_URL}/get_usuarios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const agregarUsuarioAGrupo = async (idGrupo: string, idUsuario: string, userName: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("Token no encontrado");
  }

  try {
    const response = await axios.post(
      `${API_URL}/add_user_to_grupo`,
      { idGrupo, idUsuario, userName },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) {
      message.success("Usuario agregado con éxito");
      return response.data;
    } else {
      throw new Error(`Error al agregar usuario: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error agregando usuario al grupo:", error);
    throw new Error("Hubo un error al agregar el usuario al grupo.");
  }
};


export const agregarTareaAGrupo = async (taskData: {
  idGrupo: string;
  idsUsuarios: string[];
  usernames: string[];
  nameTask: string;
  descripcion: string;
  categoria: string;
  estatus: string;
  deadLine: string;
}, token: string | null) => {
  if (!token) throw new Error("Token no disponible");

  try {
    const response = await axios.post(`${API_URL}/add_task_to_grupo`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    message.success("Tarea agregada exitosamente al grupo");
    return response.data;
  } catch (error) {
    const typedError = error as any;
    console.error("Respuesta del servidor:", typedError.response?.data);

    console.error("Respuesta del servidor:", typedError.response?.data);
    console.error("Error agregando tarea al grupo:", error);
    message.error("Error agregando tarea al grupo");
    throw error;
  }
};




