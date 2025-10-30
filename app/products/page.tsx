"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { apiClient } from "@/lib/api-client"
import { FloatingParticlesBackground } from "@/components/3d-backgrounds"
import { Filter, ChevronDown } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

const CATEGORIES = ["All", "Electronics", "Accessories", "Audio", "Cables"]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.getProducts()
        if (response.success) {
          setProducts(response.data)
          setFilteredProducts(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    } else if (sortBy === "newest") {
      filtered = [...filtered].reverse()
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, sortBy, products])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with 3D Background */}
      <section className="relative bg-gradient-to-br from-primary/10 to-accent/5 py-12 md:py-16 overflow-hidden">
        <FloatingParticlesBackground />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Products</h1>
            <p className="text-lg text-muted-foreground">Explore our complete collection of premium tech accessories</p>
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar Filters - Mobile Toggle */}
            <div className="lg:col-span-1">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg mb-4"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="font-semibold">Filters</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>

              {/* Filters Content */}
              <div className={`space-y-6 animate-slide-in-left ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full"></span>
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setShowFilters(false)
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-accent rounded-full"></span>
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: "featured", label: "Featured" },
                      { value: "newest", label: "Newest" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setShowFilters(false)
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                          sortBy === option.value
                            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
