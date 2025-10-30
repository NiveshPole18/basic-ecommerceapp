import Link from "next/link"
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">V</span>
              </div>
              <span className="font-bold text-lg">Vibe</span>
            </div>
            <p className="text-sm opacity-90">Premium tech accessories for modern professionals.</p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-base">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="opacity-90 hover:opacity-100 transition-opacity hover:translate-x-1 inline-block"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Electronics"
                  className="opacity-90 hover:opacity-100 transition-opacity hover:translate-x-1 inline-block"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Accessories"
                  className="opacity-90 hover:opacity-100 transition-opacity hover:translate-x-1 inline-block"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-base">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="opacity-90 hover:opacity-100 transition-opacity hover:translate-x-1 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="opacity-90 hover:opacity-100 transition-opacity hover:translate-x-1 inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="opacity-90 hover:opacity-100 transition-opacity hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-base">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@vibe.com" className="opacity-90 hover:opacity-100 transition-opacity">
                  support@vibe.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+1234567890" className="opacity-90 hover:opacity-100 transition-opacity">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="opacity-90">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm opacity-90 gap-4">
            <p>&copy; 2025 Vibe. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:opacity-100 transition-opacity">
                Terms of Service
              </Link>
              <Link href="#" className="hover:opacity-100 transition-opacity">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
