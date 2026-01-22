import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Users, Target } from "lucide-react"
import Image from "next/image"

export function About() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Built on blockchain technology with full transparency and security at its core.",
      color: "primary",
    },
    {
      icon: Zap,
      title: "Fast Transactions",
      description: "Lightning-fast transactions with minimal fees for optimal user experience.",
      color: "secondary",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Powered by a strong community of investors and blockchain enthusiasts.",
      color: "accent",
    },
    {
      icon: Target,
      title: "Strategic Vision",
      description: "Clear roadmap with ambitious goals for long-term growth and adoption.",
      color: "primary",
    },
  ]

  const colorClasses = {
    primary: {
      bg: "bg-primary/20",
      text: "text-primary",
      border: "border-primary/30 hover:border-primary/50",
      glow: "group-hover:shadow-[0_0_30px_rgba(0,200,200,0.3)]",
    },
    secondary: {
      bg: "bg-secondary/20",
      text: "text-secondary",
      border: "border-secondary/30 hover:border-secondary/50",
      glow: "group-hover:shadow-[0_0_30px_rgba(200,0,200,0.3)]",
    },
    accent: {
      bg: "bg-accent/20",
      text: "text-accent",
      border: "border-accent/30 hover:border-accent/50",
      glow: "group-hover:shadow-[0_0_30px_rgba(0,200,100,0.3)]",
    },
  }

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-6">
            <span className="text-sm font-medium text-primary">About Us</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="text-primary neon-text">GECIM</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Gecim is more than just a token - it is a gateway to the future of decentralized finance. Our
            innovative ecosystem combines cutting-edge blockchain technology with real-world utility, creating
            unprecedented opportunities for investors and users alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses]
            return (
              <Card
                key={index}
                className={`glass-card border ${colors.border} transition-all duration-300 group ${colors.glow}`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={32} className={colors.text} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-pretty text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-20 glass-card rounded-3xl p-8 md:p-12 border border-primary/20 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="flex justify-center lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/563-5639174_what-is-blockchain-technology-block-chain-hd-png-removebg-preview-wf73Jvv1Jw7d6BsELO95gj6Bsd7h8S.png"
                  alt="Blockchain technology applications infographic"
                  width={400}
                  height={300}
                  className="w-full max-w-md h-auto object-contain relative z-10 drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="text-center lg:text-left lg:order-1">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Why Choose <span className="text-primary neon-text">GECIM</span>?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
                With a total supply of 210 million tokens and a strategic presale allocation of 84 million tokens,
                Gecim offers early investors an exclusive opportunity to be part of a revolutionary blockchain
                project. Our token economics are designed for sustainable growth and long-term value creation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card rounded-xl p-4 border border-primary/20">
                  <div className="text-2xl font-bold text-primary neon-text mb-1">18</div>
                  <div className="text-muted-foreground text-sm">Decimal Places</div>
                </div>
                <div className="glass-card rounded-xl p-4 border border-secondary/20">
                  <div className="text-2xl font-bold text-secondary neon-text-pink mb-1">40%</div>
                  <div className="text-muted-foreground text-sm">Presale Allocation</div>
                </div>
                <div className="glass-card rounded-xl p-4 border border-accent/20">
                  <div className="text-2xl font-bold text-accent mb-1">GCM</div>
                  <div className="text-muted-foreground text-sm">Token Symbol</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
