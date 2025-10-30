const express = require("express")
const router = express.Router()
const Cart = require("../models/Cart")
const Product = require("../models/Product")

// GET cart
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId || "guest"
    let cart = await Cart.findOne({ userId })

    if (!cart) {
      cart = new Cart({ userId, items: [], total: 0 })
      await cart.save()
    }

    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" })
  }
})

// POST add to cart
router.post("/", async (req, res) => {
  try {
    const { productId, qty } = req.body
    const userId = req.query.userId || "guest"

    const product = await Product.findOne({ id: productId })
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = new Cart({ userId, items: [], total: 0 })
    }

    const existingItem = cart.items.find((item) => item.productId === productId)
    if (existingItem) {
      existingItem.qty += qty
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        image: product.image,
        qty,
      })
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    cart.updatedAt = new Date()
    await cart.save()

    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart" })
  }
})

// PUT update cart item
router.put("/:productId", async (req, res) => {
  try {
    const { qty } = req.body
    const userId = req.query.userId || "guest"
    const productId = Number.parseInt(req.params.productId)

    const cart = await Cart.findOne({ userId })
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    const item = cart.items.find((item) => item.productId === productId)
    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" })
    }

    if (qty <= 0) {
      cart.items = cart.items.filter((item) => item.productId !== productId)
    } else {
      item.qty = qty
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    cart.updatedAt = new Date()
    await cart.save()

    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart" })
  }
})

// DELETE remove from cart
router.delete("/:productId", async (req, res) => {
  try {
    const userId = req.query.userId || "guest"
    const productId = Number.parseInt(req.params.productId)

    const cart = await Cart.findOne({ userId })
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    cart.items = cart.items.filter((item) => item.productId !== productId)
    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    cart.updatedAt = new Date()
    await cart.save()

    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from cart" })
  }
})

module.exports = router
