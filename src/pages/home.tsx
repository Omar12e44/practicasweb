import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Eliminar el token almacenado
    navigate("/"); // Redirigir a la página de login
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Bienvenido al Dashboard</h1>
      <p>Has iniciado sesión correctamente.</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default Dashboard;
