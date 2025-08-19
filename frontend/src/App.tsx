import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LostFoundApp } from "./components/LostFoundApp"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LostFoundApp />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
