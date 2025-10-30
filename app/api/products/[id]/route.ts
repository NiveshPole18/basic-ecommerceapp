import { type NextRequest, NextResponse } from "next/server"

// Mock database
const products = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 199.99,
    description: "High-quality sound with noise cancellation",
    image: "/wireless-headphones.png",
    category: "Electronics",
    stock: 50,
  },
  {
    id: "2",
    name: "Ergonomic Keyboard",
    price: 89.99,
    description: "Comfortable typing experience with mechanical switches",
    image: "/ergonomic-keyboard.jpg",
    category: "Electronics",
    stock: 30,
  },
  {
    id: "3",
    name: "USB-C Hub",
    price: 49.99,
    description: "Multi-port connectivity hub for laptops",
    image: "/usb-hub.png",
    category: "Accessories",
    stock: 100,
  },
  {
    id: "4",
    name: "Laptop Stand",
    price: 39.99,
    description: "Adjustable aluminum laptop stand",
    image: "/laptop-stand.png",
    category: "Accessories",
    stock: 45,
  },
]

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = products.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    products[productIndex] = { ...products[productIndex], ...body }

    return NextResponse.json({
      success: true,
      data: products[productIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    products.splice(productIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
