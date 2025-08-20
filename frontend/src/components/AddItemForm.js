import React, { useState } from "react";
import axios from "axios";

export default function AddItemForm() {
  const [formData, setFormData] = useState({
    title: "",      // backend expects title
    desc: "",       // backend expects desc
    type: "LOST",   // LOST / FOUND
    location: "",   // backend expects location
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in to add an item.");
        return;
      }

      await axios.post("http://localhost:5000/api/items", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Item added successfully!");
      setFormData({ title: "", desc: "", type: "LOST", location: "" });
    } catch (err) {
      console.error("Error adding item:", err);
      setMessage("❌ Failed to add item. Check console.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Add New Item</h2>

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Enter item title"
          value={formData.title}
          onChange={handleChange}
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Description */}
        <textarea
          name="desc"
          placeholder="Enter item description"
          value={formData.desc}
          onChange={handleChange}
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-400"
          rows="4"
          required
        />

        {/* Type (Lost / Found) */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
        </select>

        {/* Location */}
        <input
          type="text"
          name="location"
          placeholder="Enter location"
          value={formData.location}
          onChange={handleChange}
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Submit */}
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Add Item
        </button>

        {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}
