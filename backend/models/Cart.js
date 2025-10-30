const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: Number,
      name: String,
      price: Number,
      image: String,
      qty: Number,
      addedAt: { type: Date, default: Date.now },
    },
  ],
  total: Number,
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Cart", cartSchema)
