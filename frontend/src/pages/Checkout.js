"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle } from "lucide-react"
import "./Checkout.css"

function Checkout({ cartItems, onCheckoutSuccess }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [loading, setLoading] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const [error, setError] = useState(null)

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  const taxAmount = Math.round(total * 0.18)
  const finalTotal = total + taxAmount

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your name")
      return false
    }
    if (!formData.email.trim()) {
      setError("Please enter your email")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email")
      return false
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          items: cartItems,
          total: finalTotal,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setReceipt(data)
        onCheckoutSuccess()
      } else {
        setError(data.error || "Checkout failed")
      }
    } catch (err) {
      setError("Failed to process checkout. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0 && !receipt) {
    return (
      <motion.div className="checkout-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <AlertCircle size={80} color="var(--accent)" />
        <h2>Your cart is empty</h2>
        <p>Add items to your cart before checking out</p>
        <button onClick={() => navigate("/")} className="back-btn">
          Back to Products
        </button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {receipt ? (
        <motion.div
          key="receipt"
          className="receipt-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="receipt-content" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6 }}>
              <CheckCircle size={80} color="var(--success)" />
            </motion.div>

            <h1>Order Confirmed!</h1>
            <p className="success-message">{receipt.message}</p>

            <div className="receipt-details">
              <div className="receipt-row">
                <span>Order ID</span>
                <span className="receipt-value">{receipt.orderId}</span>
              </div>
              <div className="receipt-row">
                <span>Customer Name</span>
                <span className="receipt-value">{formData.name}</span>
              </div>
              <div className="receipt-row">
                <span>Email</span>
                <span className="receipt-value">{formData.email}</span>
              </div>
              <div className="receipt-row">
                <span>Items</span>
                <span className="receipt-value">{cartItems.length}</span>
              </div>
              <div className="receipt-divider"></div>
              <div className="receipt-row total">
                <span>Total Amount</span>
                <span className="receipt-value">₹{receipt.total.toLocaleString()}</span>
              </div>
              <div className="receipt-row">
                <span>Order Date</span>
                <span className="receipt-value">{new Date(receipt.timestamp).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="receipt-actions">
              <motion.button
                className="primary-btn"
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Shopping
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          className="checkout-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="checkout-container">
            <motion.div
              className="checkout-form-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Checkout</h1>

              {error && (
                <motion.div className="error-alert" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <AlertCircle size={20} />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <motion.input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Processing..." : "Place Order"}
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              className="checkout-summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2>Order Summary</h2>

              <div className="summary-items">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    className="summary-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <img src={item.image || "/placeholder.svg"} alt={item.name} />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-qty">Qty: {item.qty}</p>
                    </div>
                    <p className="item-price">₹{(item.price * item.qty).toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>

              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="breakdown-row">
                  <span>Tax (18%)</span>
                  <span>₹{taxAmount.toLocaleString()}</span>
                </div>
                <div className="breakdown-divider"></div>
                <div className="breakdown-row total">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Checkout
