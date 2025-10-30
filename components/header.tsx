"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover-scale">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center hover-glow shadow-lg">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Vibe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-foreground hover:text-primary transition-colors duration-300 relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/orders"
              className="text-foreground hover:text-primary transition-colors duration-300 relative group"
            >
              Orders
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors duration-300 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors duration-300 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative group">
              <Button variant="ghost" size="icon" className="hover-scale">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse-glow font-semibold">
                  {count}
                </span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden transition-transform duration-300 hover:scale-110"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2 animate-slide-in-down">
            <Link
              href="/products"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors duration-300"
            >
              Products
            </Link>
            <Link
              href="/orders"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors duration-300"
            >
              Orders
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors duration-300"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors duration-300"
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
