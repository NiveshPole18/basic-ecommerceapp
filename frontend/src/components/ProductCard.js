"use client"
import { motion } from "framer-motion"
import { ShoppingCart, Star } from "lucide-react"
import "./ProductCard.css"

function ProductCard({ product, onAddToCart, loading }) {
  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
    >
      <div className="product-image-container">
        <motion.img
          src={product.image}
          alt={product.name}
          className="product-image"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="product-overlay">
          <motion.button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product.id)}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={18} />
            {loading ? "Adding..." : "Add to Cart"}
          </motion.button>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating) ? "var(--accent)" : "none"}
                color={i < Math.floor(product.rating) ? "var(--accent)" : "var(--border)"}
              />
            ))}
          </div>
          <span className="review-count">({product.reviews})</span>
        </div>

        <div className="product-footer">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          <span className="product-category">{product.category}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
