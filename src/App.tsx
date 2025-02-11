import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './auth/login'
import Register from './auth/register'
import Dashboard from './pages/home'
import ManipulateDOM from './pages/manipuleDOOM'

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manipulador" element={<ManipulateDOM />} />

      </Routes>
    </Router>
  )
}

export default App
