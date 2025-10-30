"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import "./App.css"

function App() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  const userId = "guest"

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch(`/api/cart?userId=${userId}`)
      const data = await response.json()
      setCartItems(data.items || [])
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    }
  }

  const addToCart = async (productId, qty = 1) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/cart?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty }),
      })
      const data = await response.json()
      setCartItems(data.items || [])
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`/api/cart/${productId}?userId=${userId}`, {
        method: "DELETE",
      })
      const data = await response.json()
      setCartItems(data.items || [])
    } catch (error) {
      console.error("Failed to remove from cart:", error)
    }
  }

  const updateCartItem = async (productId, qty) => {
    try {
      const response = await fetch(`/api/cart/${productId}?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty }),
      })
      const data = await response.json()
      setCartItems(data.items || [])
    } catch (error) {
      console.error("Failed to update cart:", error)
    }
  }

  return (
    <Router>
      <div className="app">
        <Navbar cartCount={cartItems.length} />
        <Routes>
          <Route path="/" element={<Products addToCart={addToCart} loading={loading} />} />
          <Route
            path="/cart"
            element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} updateCartItem={updateCartItem} />}
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                cartItems={cartItems}
                onCheckoutSuccess={() => {
                  setCartItems([])
                  fetchCart()
                }}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
