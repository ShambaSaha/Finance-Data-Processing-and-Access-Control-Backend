const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// 🔥 Index for performance
recordSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Record", recordSchema);