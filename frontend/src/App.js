import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import LostFound from "./pages/LostFound"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/lostfound" replace />} />
          <Route path="/lostfound" element={<LostFound />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
