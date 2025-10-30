"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    description: string
    image: string
    stock: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()
  const { refresh } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      const response = await apiClient.addToCart({
        productId: product.id,
        quantity: 1,
        price: product.price,
        name: product.name,
      })

      if (response.success) {
        await refresh()
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover-lift h-full flex flex-col">
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-center px-4">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300 text-sm sm:text-base">
            {product.name}
          </h3>
          <Star className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-1">{product.description}</p>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className="gap-1 sm:gap-2 hover-scale text-xs sm:text-sm"
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
