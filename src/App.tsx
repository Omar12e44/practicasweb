import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/LoginPage/LoginPage'
import Register from './pages/RegisterPage/RegisterPage'
import Dashboard from './pages/Dashboard/DashboardPage'
import MainLayout from './layouts/MainLayouts'
import PrivateRoute from './components/Private/PrivateRoute'


function App() {


  return (
    <Router>
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
      </Routes>
    </Router>
  )
}

export default App
