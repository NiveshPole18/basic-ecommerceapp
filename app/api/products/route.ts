import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, this would be MongoDB/Mongoose
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let filteredProducts = products
    if (category) {
      filteredProducts = products.filter((p) => p.category === category)
    }

    return NextResponse.json({
      success: true,
      data: filteredProducts,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newProduct = {
      id: String(products.length + 1),
      ...body,
    }
    products.push(newProduct)

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
