"use client"

import { useState } from "react"
import axios from "axios"
import { Calendar, MapPin, User, MessageCircle } from "lucide-react"

interface Item {
  _id: string
  title: string
  description: string
  type: "lost" | "found"
  location: string
  dateReported: string
  reportedBy: {
    name: string
    email: string
  }
  status: "active" | "claimed"
}

interface ItemCardProps {
  item: Item
  onUpdate: () => void
}

export function ItemCard({ item, onUpdate }: ItemCardProps) {
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = "http://localhost:5000/api"

  const handleClaim = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      await axios.patch(
        `${API_BASE_URL}/items/${item._id}/claim`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      onUpdate()
    } catch (error) {
      console.error("Failed to claim item:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-serif font-semibold text-card-foreground">{item.title}</h3>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
              item.type === "lost" ? "bg-destructive/10 text-destructive" : "bg-secondary/20 text-secondary-foreground"
            }`}
          >
            {item.type === "lost" ? "Lost" : "Found"}
          </span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          }`}
        >
          {item.status === "active" ? "Active" : "Claimed"}
        </span>
      </div>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{item.description}</p>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>{new Date(item.dateReported).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>{item.reportedBy.name}</span>
        </div>
      </div>

      {item.status === "active" && (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={handleClaim}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{loading ? "Claiming..." : "Claim Item"}</span>
          </button>
        </div>
      )}
    </div>
  )
}
