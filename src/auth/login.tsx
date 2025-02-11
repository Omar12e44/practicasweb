import { useState, ChangeEvent, FormEvent } from "react";  // Importar React y Axios
import axios from "axios";  // Importar axios para hacer solicitudes HTTP

const Login = () => {
  // Estado para manejar los datos del formulario (usuario y contraseña)
  const [formData, setFormData] = useState({ username: "", password: "" });
  // Estado para manejar el mensaje de error (si ocurre)
  const [errorMessage, setErrorMessage] = useState("");

  // Función para manejar los cambios en los campos del formulario
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Actualiza el estado de formData con el nuevo valor del campo
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Prevenir la recarga de la página al enviar el formulario
    setErrorMessage("");  // Limpiar mensaje de error previo

    interface LoginResponse {
      statusCode: number;  // Código de estado de la respuesta
      data: {
        token: string;  // Token de autenticación que se recibirá en caso de éxito
      };
      intMessage?: string;  // Mensaje de error (si existe)
    }

    try {
      // Hacer una solicitud POST al backend con los datos del formulario
      const response = await axios.post<LoginResponse>("http://127.0.0.1:5000/login", formData);

      // Verificar si el login fue exitoso (código de estado 200)
      if (response.data.statusCode === 200) {
        const token = response.data.data.token;  // Obtener el token de la respuesta

        // Guardar el token en sessionStorage para persistencia
        sessionStorage.setItem("token", token);

        // Redirigir al usuario al dashboard
        window.location.href = "/dashboard"; 
      } else {
        // Si las credenciales no son válidas, mostrar el mensaje de error
        setErrorMessage(response.data.intMessage || "Credenciales inválidas");
      }
    // Manejo de errores de la solicitud
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Mostrar el mensaje de error correspondiente si ocurre un problema
      setErrorMessage(error.response?.data?.intMessage || "Error en la solicitud");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>Iniciar Sesión</h1>

      <form onSubmit={handleSubmit}>
        {/* Campo de entrada para el nombre de usuario */}
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Campo de entrada para la contraseña */}
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Enlace para redirigir al formulario de registro */}
        <a href="/register">Registro</a>

        {/* Botón para enviar el formulario */}
        <button type="submit">Ingresar</button>

        {/* Mostrar el mensaje de error si existe */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
