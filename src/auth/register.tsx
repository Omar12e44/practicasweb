// Importamos los hooks de React necesarios para el estado y el manejo de eventos
import { useState, ChangeEvent, FormEvent } from "react";
// Importamos axios para realizar solicitudes HTTP
import axios from "axios";

// Definimos el componente Register
const Register = () => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    username: "", // Nombre de usuario
    password: "", // Contraseña
    email: "", // Correo electrónico
    birth_date: "", // Fecha de nacimiento
    full_name: "" // Nombre completo
  });

  // Estado para manejar los mensajes de error
  const [errorMessage, setErrorMessage] = useState("");
  // Estado para manejar los mensajes de éxito
  const [successMessage, setSuccessMessage] = useState("");

  // Función para manejar los cambios en los campos del formulario
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Actualiza el estado con los nuevos valores del formulario
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página)
    
    // Limpiamos los mensajes de error y éxito antes de enviar la solicitud
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Realizamos una solicitud POST a la API de registro
      const response = await axios.post<{ statusCode: number; intMessage?: string }>(
        "http://127.0.0.1:5000/register", // URL de la API
        formData // Datos del formulario
      );

      // Comprobamos el código de estado en la respuesta
      if (response.data.statusCode === 201) {
        // Si la respuesta es 201, significa que el registro fue exitoso
        setSuccessMessage("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
        // Limpiamos el formulario después del registro exitoso
        setFormData({ username: "", password: "", email: "", birth_date: "", full_name: "" });
      } else {
        // Si no es 201, mostramos el mensaje de error recibido de la API
        setErrorMessage(response.data.intMessage || "Error al registrar usuario.");
      }
    // Manejamos cualquier error de la solicitud HTTP
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.response?.data?.intMessage || "Error en la solicitud.");
    }
  };

  return (
    // El contenedor del formulario con un estilo simple
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>Registro</h1>

      {/* Formulario que llama a handleSubmit al enviarlo */}
      <form onSubmit={handleSubmit}>
        {/* Campo de nombre de usuario */}
        <div>
          <label>Usuario:</label>
          <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
        </div>

        {/* Campo de correo electrónico */}
        <div>
          <label>Correo Electrónico:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>

        {/* Campo de nombre completo */}
        <div>
          <label>Nombre Completo:</label>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required />
        </div>

        {/* Campo de fecha de nacimiento */}
        <div>
          <label>Fecha de Nacimiento:</label>
          <input type="date" name="birth_date" value={formData.birth_date} onChange={handleInputChange} required />
        </div>

        {/* Campo de contraseña */}
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
        </div>

        {/* Botón para enviar el formulario */}
        <button type="submit">Registrarse</button>

        {/* Mensajes de error o éxito */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default Register;
