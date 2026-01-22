import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Roadmap } from "@/components/roadmap"
import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Roadmap />
      <Contact />
    </main>
  )
}
