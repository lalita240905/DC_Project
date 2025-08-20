"use client";

import { useState } from "react";
import axios from "axios";

const ItemCard = ({ item, onClaim }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleClaim = async () => {
    if (!token) {
      alert("Please login to claim items");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/items/${item._id}/claim`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Item claimed successfully!");
      onClaim(item._id, data.item);
    } catch (error) {
      alert(error.response?.data?.error || error.response?.data?.message || "Failed to claim item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cream-100 border border-blue-200 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-blue-800">{item.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            item.status === "active"
              ? "bg-blue-100 text-blue-700"
              : item.status === "claimed"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {item.status?.toUpperCase()}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4">{item.desc}</p>

      {/* Info Section */}
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p>
          <strong className="text-blue-700">Type:</strong> {item.type}
        </p>
        <p>
          <strong className="text-blue-700">Location:</strong> {item.location}
        </p>
        <p>
          <strong className="text-blue-700">Posted by:</strong> {item.posted_by}
        </p>
        <p>
          <strong className="text-blue-700">Date:</strong>{" "}
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Claim Button */}
      {!item.claimedBy ? (
        <button
          onClick={handleClaim}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Claiming..." : "Claim Item"}
        </button>
      ) : (
        <div className="text-center py-2 text-gray-500 italic">
          Already Claimed
        </div>
      )}
    </div>
  );
};

export default ItemCard;
