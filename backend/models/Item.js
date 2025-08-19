const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Books", "Keys", "Jewelry", "Bags", "Documents", "Sports Equipment", "Other"],
    },
    type: {
      type: String,
      required: true,
      enum: ["lost", "found"],
    },
    status: {
      type: String,
      enum: ["active", "claimed", "returned"],
      default: "active",
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    dateFound: {
      type: Date,
    },
    dateLost: {
      type: Date,
    },
    contactInfo: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String, // URLs to uploaded images
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    claimedAt: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    reward: {
      type: Number,
      min: 0,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Index for text search
itemSchema.index({
  title: "text",
  description: "text",
  location: "text",
  tags: "text",
})

// Index for filtering
itemSchema.index({ category: 1, type: 1, status: 1 })
itemSchema.index({ userId: 1 })
itemSchema.index({ createdAt: -1 })

module.exports = mongoose.model("Item", itemSchema)
