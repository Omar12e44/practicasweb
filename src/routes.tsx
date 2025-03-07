import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage/LoginPage';
import Register from './pages/RegisterPage/RegisterPage';
import Dashboard from './pages/Dashboard/DashboardPage';
import MainLayout from './layouts/MainLayouts';
import PrivateRoute from './components/Private/PrivateRoute';
import Grupos from './pages/GrupoPage/GrupoPage';
import UserList from './pages/Users/users';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
            
      {/* Rutas protegidas (requieren autenticación) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/grupos"
        element={
          <PrivateRoute>
            <MainLayout>
              <Grupos />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
      path='/users'
      element={
        <PrivateRoute>
          <MainLayout>
            <UserList />
          </MainLayout>
        </PrivateRoute>
      }
      />
    </Routes>
  );
}

export default AppRoutes;
