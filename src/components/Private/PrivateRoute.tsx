import React from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: JSX.Element
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token') // Verifica localStorage

  return isAuthenticated ? children : <Navigate to="/" />
}

export default PrivateRoute