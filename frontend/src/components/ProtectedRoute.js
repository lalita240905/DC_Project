// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")

  if (!token) {
    // not logged in → redirect to login
    return <Navigate to="/login" replace />
  }

  return children // logged in → allow access
}

export default ProtectedRoute
