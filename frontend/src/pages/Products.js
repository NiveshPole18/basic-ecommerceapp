"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ProductCard from "../components/ProductCard"
import "./Products.css"

function Products({ addToCart, loading }) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/products")
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError("Failed to load products. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="products-page">
      <motion.div
        className="products-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Vibe Commerce</h1>
        <p>Discover premium tech products curated for you</p>
      </motion.div>

      {error && (
        <motion.div className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {error}
        </motion.div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <motion.div
            className="spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="products-container">
          <motion.div
            className="products-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} loading={loading} />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Products
