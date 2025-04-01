import { Routes, Route } from 'react-router-dom'
import Login from './pages/LoginPage/LoginPage'
import Register from './pages/RegisterPage/RegisterPage'
import Dashboard from './pages/Dashboard/DashboardPage'
import MainLayout from './layouts/MainLayouts'
import PrivateRoute from './components/Private/PrivateRoute'
import Grupos from './pages/GrupoPage/GrupoPage'
import CrudUsers from './pages/Users/CrudUsers'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
        path="/usuarios"
        element={
          <PrivateRoute>
            <MainLayout>
              <CrudUsers />
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes