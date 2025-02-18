import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Form, Input, Button, message, Card } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    interface LoginResponse {
      statusCode: number;
      data: { token: string };
      intMessage?: string;
    }

    try {
      const response = await axios.post<LoginResponse>("http://127.0.0.1:5000/login", formData);

      if (response.data.statusCode === 200) {
        localStorage.setItem("token", response.data.data.token);
        message.success("Inicio de sesión exitoso");
        window.location.href = "/dashboard";
      } else {
        message.error(response.data.intMessage || "Credenciales inválidas");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.response?.data?.intMessage || "Error en la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <h1 className="login-title">Iniciar Sesión</h1>

        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <Form.Item label="Usuario" name="email" rules={[{ required: true, message: "Ingrese su usuario" }]}>
            <Input
              prefix={<UserOutlined />}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ingrese su usuario"
            />
          </Form.Item>

          <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: "Ingrese su contraseña" }]}>
            <Input.Password
              prefix={<LockOutlined />}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Ingrese su contraseña"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Ingresar
            </Button>
          </Form.Item>
        </Form>

        <a href="/register" className="register-link">¿No tienes cuenta? Regístrate</a>
      </Card>
    </div>
  );
};

export default Login;