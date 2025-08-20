const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      required: true,
      enum: ["found", "lost"],
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
    posted_by: {
      type: String, // Or ObjectId if linking to User
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    claimedAt: {
      type: Date,
    },
    images: [
      {
        type: String, // URLs to uploaded images
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Index for text search
itemSchema.index({
  title: "text",
  desc: "text",
  location: "text",
})

// Index for filtering
itemSchema.index({ type: 1, status: 1 })
itemSchema.index({ posted_by: 1 })
itemSchema.index({ createdAt: -1 })

module.exports = mongoose.model("Item", itemSchema)
