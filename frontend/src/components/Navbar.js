"use client"
import { Link, useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/lostfound")
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/lostfound" className="text-xl font-bold text-blue-600">
            Lost & Found
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/lostfound" className="text-gray-700 hover:text-blue-600">
              Browse Items
            </Link>

            {token ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Login
                </Link>
                <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

//hiya