"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, AlertCircle } from "lucide-react"
import { LoginForm } from "./login-form"
import { ItemCard } from "./item-card"

interface Item {
  _id: string
  type: "LOST" | "FOUND"
  title: string
  desc: string
  posted_by: string
  claimed_by?: string
  createdAt?: string
}

export function LostFoundApp() {
  const [user, setUser] = useState<{ username: string; token: string } | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"ALL" | "LOST" | "FOUND">("ALL")
  const [form, setForm] = useState({
    type: "LOST" as "LOST" | "FOUND",
    title: "",
    desc: "",
  })

  // Check for existing auth token
  useEffect(() => {
    const token = localStorage.getItem("token")
    const username = localStorage.getItem("username")
    if (token && username) {
      setUser({ token, username })
    }
  }, [])

  // Fetch items when user is authenticated
  useEffect(() => {
    if (user) {
      fetchItems()
    }
  }, [user])

  const fetchItems = async () => {
    try {
      // Replace with your backend URL when deploying to separate devices
      const response = await fetch("http://localhost:5000/items", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Error fetching items:", error)
    }
  }

  const handleLogin = (userData: { username: string; token: string }) => {
    setUser(userData)
    localStorage.setItem("token", userData.token)
    localStorage.setItem("username", userData.username)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("username")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        setForm({ type: "LOST", title: "", desc: "" })
        setShowAddForm(false)
        fetchItems()
      }
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const handleClaim = async (itemId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/items/${itemId}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      })

      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error("Error claiming item:", error)
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "ALL" || item.type === filterType
    return matchesSearch && matchesFilter
  })

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">Lost & Found</h1>
                <p className="text-sm text-muted-foreground">Connect. Recover. Reunite.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.username}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: "ALL" | "LOST" | "FOUND") => setFilterType(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Items</SelectItem>
              <SelectItem value="LOST">Lost Items</SelectItem>
              <SelectItem value="FOUND">Found Items</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif">Report an Item</CardTitle>
              <CardDescription>Help others by reporting lost or found items in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={form.type}
                      onValueChange={(value: "LOST" | "FOUND") => setForm({ ...form, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOST">Lost Item</SelectItem>
                        <SelectItem value="FOUND">Found Item</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Item Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Black Wallet, iPhone 13"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    placeholder="Provide details about the item, where it was lost/found, etc."
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    required
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Submit Report</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "ALL"
                  ? "Try adjusting your search or filter criteria"
                  : "Be the first to report a lost or found item"}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} currentUser={user.username} onClaim={handleClaim} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
