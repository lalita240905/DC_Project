"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { LoginForm } from "./LoginForm"
import { ItemCard } from "./ItemCard"
import { Search, Plus, LogOut, User } from "lucide-react"

export function LostFoundApp() {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)

  const API_BASE_URL = "http://localhost:5000/api"

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem("token")
    if (token) {
      fetchUserProfile(token)
      fetchItems()
    }
  }, [])

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(response.data)
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      localStorage.removeItem("token")
    }
  }

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`)
      setItems(response.data)
    } catch (error) {
      console.error("Failed to fetch items:", error)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData.user)
    localStorage.setItem("token", userData.token)
    fetchItems()
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("token")
    setItems([])
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-serif font-bold text-primary">Lost & Found</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Items</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items
            .filter((item) => {
              const matchesSearch =
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
              const matchesFilter = filterType === "all" || item.type === filterType
              return matchesSearch && matchesFilter
            })
            .map((item) => (
              <ItemCard key={item._id} item={item} onUpdate={fetchItems} />
            ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found. Be the first to add one!</p>
          </div>
        )}
      </main>
    </div>
  )
}
