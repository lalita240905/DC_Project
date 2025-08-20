"use client"

import { useState } from "react"
import axios from "axios"

const ItemCard = ({ item, onClaim }) => {
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem("token")

  const handleClaim = async () => {
    if (!token) {
      alert("Please login to claim items")
      return
    }

    setLoading(true)
    try {
      await axios.post(
        `http://localhost:5000/api/items/${item._id}/claim`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      alert("Item claimed successfully!")
      onClaim(item._id)
    } catch (error) {
      alert(error.response?.data?.message || "Failed to claim item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            item.status === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {item.status.toUpperCase()}
        </span>
      </div>

      <p className="text-gray-600 mb-3">{item.description}</p>

      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <p>
          <strong>Category:</strong> {item.category}
        </p>
        <p>
          <strong>Location:</strong> {item.location}
        </p>
        <p>
          <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Contact:</strong> {item.contactInfo}
        </p>
      </div>

      {!item.claimed && (
        <button
          onClick={handleClaim}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Claiming..." : "Claim Item"}
        </button>
      )}

      {item.claimed && <div className="text-center py-2 text-gray-500">Already Claimed</div>}
    </div>
  )
}

export default ItemCard
