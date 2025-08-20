const mongoose = require("mongoose")

const claimSchema = new mongoose.Schema(
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    claimed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
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
  { timestamps: true }
);

// Indexes
claimSchema.index({ item_id: 1 });
claimSchema.index({ claimed_by: 1 });
claimSchema.index({ status: 1 });
claimSchema.index({ claim_date: -1 });
claimSchema.index({ item_id: 1, claimed_by: 1 }, { unique: true });

module.exports = mongoose.model("Claim", claimSchema);
