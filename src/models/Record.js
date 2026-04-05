const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  type: { type: String, enum: ["income", "expense"] },
  category: String,
  date: Date,
  isDeleted: {
  type: Boolean,
  default: false
    },
  note: String
}, { timestamps: true });

module.exports = mongoose.model("Record", recordSchema);