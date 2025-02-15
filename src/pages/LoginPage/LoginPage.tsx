import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {  Input, Space } from 'antd';

const Login = () => {
 
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const [formData, setFormData] = useState({ username: "", password: "" });
  
  const [errorMessage, setErrorMessage] = useState("");

  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
   
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    interface LoginResponse {
      statusCode: number;
      data: {
        token: string;
      };
      intMessage?: string;
    }

    try {
      const response = await axios.post<LoginResponse>("http://127.0.0.1:5000/login", formData);

      if (response.data.statusCode === 200) {
        const token = response.data.data.token;

        localStorage.setItem("token", token);

        window.location.href = "/dashboard"; 
      } else {
        setErrorMessage(response.data.intMessage || "Credenciales inválidas");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.response?.data?.intMessage || "Error en la solicitud");
    }
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Iniciar Sesión</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label style={styles.label}>Usuario:</label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Ingrese su usuario"
            required
            style={styles.input}
          />
        </div>

        <div>
          <Space direction="vertical">
          <label style={styles.label}>Contraseña:</label>
            <Input.Password
            
              placeholder="Ingrese su contraseña"
              visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </Space>
        </div>

        <button type="submit" style={styles.submitButton}>Ingresar</button>

        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

        <a href="/register" style={styles.registerLink}>¿No tienes cuenta? Regístrate</a>
      </form>
    </div>
  );
};

// Styles object
import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: "40px",
    maxWidth: "400px",
    margin: "auto",
    backgroundColor: "#f4f7fa",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontWeight: "600",
    marginBottom: "5px",
  },
  input: {
    borderRadius: "4px",
    padding: "10px",
    fontSize: "14px",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  submitButtonHover: {
    backgroundColor: "#45a049",
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  },
  registerLink: {
    textAlign: "center",
    display: "block",
    color: "#007bff",
    textDecoration: "none",
    marginTop: "15px",
  },
};



export default Login;
