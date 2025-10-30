"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import "./Navbar.css"

function Navbar({ cartCount }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav className="navbar" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Vibe Commerce
          </motion.div>
        </Link>

        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <motion.ul
          className={`nav-menu ${isOpen ? "active" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <li className="nav-item">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <motion.span whileHover={{ color: "var(--accent)" }}>Products</motion.span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" onClick={() => setIsOpen(false)}>
              <motion.div className="cart-link" whileHover={{ scale: 1.1 }}>
                <ShoppingCart size={20} />
                <span className="cart-badge">{cartCount}</span>
              </motion.div>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/checkout" onClick={() => setIsOpen(false)}>
              <motion.span whileHover={{ color: "var(--accent)" }}>Checkout</motion.span>
            </Link>
          </li>
        </motion.ul>
      </div>
    </motion.nav>
  )
}

export default Navbar
