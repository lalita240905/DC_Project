const mongoose = require("mongoose")

const claimSchema = new mongoose.Schema(
  {
    claim_id: {
      type: Number,
      required: true,
      unique: true,
    },
    item_id: {
      type: Number,
      required: true,
      ref: "Item",
    },
    claimed_by: {
      type: Number,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    claim_date: {
      type: Date,
      default: Date.now,
    },
    verification_details: {
      type: String,
      maxlength: 500,
    },
    admin_notes: {
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
claimSchema.index({ item_id: 1 })
claimSchema.index({ claimed_by: 1 })
claimSchema.index({ status: 1 })
claimSchema.index({ claim_date: -1 })

// Compound index for efficient queries
claimSchema.index({ item_id: 1, claimed_by: 1 }, { unique: true })

module.exports = mongoose.model("Claim", claimSchema)
