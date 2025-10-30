import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"
import { AnimatedSphereBackground } from "@/components/3d-backgrounds"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="relative">
        <AnimatedSphereBackground />
        <Hero />
      </div>
      <ProductGrid />
      <Footer />
    </main>
  )
}
