const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const Cart = require("../models/Cart")

// POST checkout
router.post("/", async (req, res) => {
  try {
    const { name, email, items, total } = req.body
    const userId = req.query.userId || "guest"

    if (!name || !email || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const orderId = "ORD-" + Date.now()
    const order = new Order({
      orderId,
      name,
      email,
      items,
      total,
      timestamp: new Date(),
    })

    await order.save()

    // Clear cart
    await Cart.findOneAndUpdate({ userId }, { items: [], total: 0 })

    res.json({
      success: true,
      orderId,
      total,
      timestamp: new Date().toISOString(),
      message: "Order placed successfully!",
    })
  } catch (error) {
    res.status(500).json({ error: "Checkout failed" })
  }
})

module.exports = router
