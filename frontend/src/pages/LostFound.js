"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ItemCard from "../components/ItemCard"

const LostFound = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, filter])

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/items")
      setItems(response.data)
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    if (filter === "ALL") {
      setFilteredItems(items)
    } else {
      setFilteredItems(items.filter((item) => item.status.toUpperCase() === filter))
    }
  }

  const handleClaim = (itemId) => {
    setItems(items.map((item) => (item._id === itemId ? { ...item, claimed: true } : item)))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading items...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Lost & Found Items</h1>
        <p className="text-gray-600">Find your lost items or help others find theirs</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {["ALL", "LOST", "FOUND"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === filterType ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {filterType} (
              {filterType === "ALL"
                ? items.length
                : items.filter((item) => item.status.toUpperCase() === filterType).length}
              )
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found for the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} onClaim={handleClaim} />
          ))}
        </div>
      )}
    </div>
  )
}

export default LostFound
