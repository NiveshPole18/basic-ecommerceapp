const express = require("express")
const router = express.Router()
const Product = require("../models/Product")

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    price: 1999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    description: "Premium noise-cancelling wireless headphones",
    category: "Audio",
    rating: 4.8,
    reviews: 324,
    inStock: true,
  },
  {
    id: 2,
    name: "Smart Watch Ultra",
    price: 2499,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    description: "Advanced fitness tracking smartwatch",
    category: "Wearables",
    rating: 4.6,
    reviews: 512,
    inStock: true,
  },
  {
    id: 3,
    name: "USB-C Fast Charger",
    price: 799,
    image: "https://images.unsplash.com/photo-1591290621749-2c547fab1726?w=500&h=500&fit=crop",
    description: "65W ultra-fast charging technology",
    category: "Accessories",
    rating: 4.7,
    reviews: 1203,
    inStock: true,
  },
  {
    id: 4,
    name: "Portable SSD 1TB",
    price: 3499,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop",
    description: "Ultra-fast portable storage solution",
    category: "Storage",
    rating: 4.9,
    reviews: 856,
    inStock: true,
  },
  {
    id: 5,
    name: "Mechanical Keyboard RGB",
    price: 1299,
    image: "https://images.unsplash.com/photo-1587829191301-4b5556b1047e?w=500&h=500&fit=crop",
    description: "Premium mechanical keyboard with RGB lighting",
    category: "Peripherals",
    rating: 4.7,
    reviews: 678,
    inStock: true,
  },
  {
    id: 6,
    name: "4K Webcam Pro",
    price: 1599,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop",
    description: "Professional 4K streaming webcam",
    category: "Video",
    rating: 4.8,
    reviews: 445,
    inStock: true,
  },
  {
    id: 7,
    name: "Wireless Mouse Pro",
    price: 599,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop",
    description: "Ergonomic wireless mouse with precision tracking",
    category: "Peripherals",
    rating: 4.6,
    reviews: 892,
    inStock: true,
  },
  {
    id: 8,
    name: "Phone Stand Premium",
    price: 399,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c3ca4b7f1?w=500&h=500&fit=crop",
    description: "Adjustable aluminum phone stand",
    category: "Accessories",
    rating: 4.5,
    reviews: 234,
    inStock: true,
  },
]

// GET all products
router.get("/", async (req, res) => {
  try {
    let products = await Product.find()
    if (products.length === 0) {
      // Seed with mock data if empty
      await Product.insertMany(mockProducts)
      products = mockProducts
    }
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" })
  }
})

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number.parseInt(req.params.id) })
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" })
  }
})

module.exports = router
