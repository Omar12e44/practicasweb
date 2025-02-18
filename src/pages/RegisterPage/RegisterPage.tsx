import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Input, Button, Card, Typography, message } from "antd";

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    rol: "",
  });

  const [loading, setLoading] = useState(false);

  // Manejar cambios en los inputs
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post<{ statusCode: number; intMessage?: string }>(
        "http://127.0.0.1:5000/register",
        formData
      );

      if (response.data.statusCode === 201) {
        message.success("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
        // Limpiar formulario
        setFormData({ username: "", password: "", email: "", rol: "" });
      } else {
        message.error(response.data.intMessage || "Error al registrar usuario.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.response?.data?.intMessage || "Error en la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <Title level={2} className="register-title">
          Registro
        </Title>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="register-label">Usuario:</label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Ingrese su usuario"
              required
              className="register-input"
            />
          </div>

          <div className="form-group">
            <label className="register-label">Correo Electrónico:</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ingrese su correo"
              required
              className="register-input"
            />
          </div>

          <div className="form-group">
            <label className="register-label">Rol:</label>
            <Input
              type="text"
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              placeholder="Ingrese su rol"
              required
              className="register-input"
            />
          </div>

          <div className="form-group">
            <label className="register-label">Contraseña:</label>
            <Input.Password
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Ingrese su contraseña"
              required
              className="register-input"
            />
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="register-button"
          >
            Registrarse
          </Button>

          <Text className="register-login-link">
            ¿Ya tienes una cuenta? <a href="/">Iniciar sesión</a>
          </Text>
        </form>
      </Card>
    </div>
  );
};

export default Register;
