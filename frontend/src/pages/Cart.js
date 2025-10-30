"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import "./Cart.css"

function Cart({ cartItems, removeFromCart, updateCartItem }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)

  if (cartItems.length === 0) {
    return (
      <motion.div
        className="empty-cart"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
          <ShoppingCart size={80} color="var(--accent)" />
        </motion.div>
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items to your cart</p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div className="cart-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="cart-container">
        <h1>Shopping Cart</h1>

        <div className="cart-content">
          <motion.div
            className="cart-items"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {cartItems.map((item, index) => (
              <motion.div
                key={item.productId}
                className="cart-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />

                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price.toLocaleString()}</p>
                </div>

                <div className="item-quantity">
                  <motion.button
                    onClick={() => updateCartItem(item.productId, item.qty - 1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus size={18} />
                  </motion.button>
                  <span>{item.qty}</span>
                  <motion.button
                    onClick={() => updateCartItem(item.productId, item.qty + 1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus size={18} />
                  </motion.button>
                </div>

                <div className="item-total">₹{(item.price * item.qty).toLocaleString()}</div>

                <motion.button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.productId)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 size={18} />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="cart-summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>₹{Math.round(total * 0.18).toLocaleString()}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{Math.round(total * 1.18).toLocaleString()}</span>
            </div>

            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>

            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Cart
