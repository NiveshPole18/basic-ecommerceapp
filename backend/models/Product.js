const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
  rating: Number,
  reviews: Number,
  inStock: Boolean,
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Product", productSchema)
