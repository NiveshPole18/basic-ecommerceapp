const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  orderId: String,
  name: String,
  email: String,
  items: Array,
  total: Number,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: "completed" },
})

module.exports = mongoose.model("Order", orderSchema)
