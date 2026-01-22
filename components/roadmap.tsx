import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Rocket, TrendingUp, Users, Building, Unlock, Globe, BarChart, ShoppingBag } from "lucide-react"

export function Roadmap() {
  const roadmapItems = [
    {
      date: "SEP 2025",
      title: "TOKEN LAUNCH",
      description: "Official launch of Gecim token with initial distribution",
      status: "upcoming",
      icon: Rocket,
    },
    {
      date: "SEP 2025",
      title: "PRESALE LAUNCH",
      description: "Begin public presale with exclusive early bird pricing",
      status: "current",
      icon: TrendingUp,
    },
    {
      date: "OCT 2025",
      title: "DEX LAUNCH",
      description: "List Gecim on major DEX platforms for trading",
      status: "upcoming",
      icon: Globe,
    },
    {
      date: "NOV 2025",
      title: "MILLIONAIRE CLUB",
      description: "Exclusive membership program for high-value holders",
      status: "upcoming",
      icon: Users,
    },
    {
      date: "DEC 2025",
      title: "CEX LAUNCH",
      description: "Major CEX listings for increased liquidity",
      status: "upcoming",
      icon: Building,
    },
    {
      date: "JAN 2026",
      title: "TOKEN UNLOCK",
      description: "Begin scheduled token unlock for early investors",
      status: "upcoming",
      icon: Unlock,
    },
    {
      date: "FEB 2026",
      title: "MULTI-EXCHANGE",
      description: "Expand to additional trading platforms worldwide",
      status: "upcoming",
      icon: Globe,
    },
    {
      date: "MAR 2026",
      title: "CMC LISTING",
      description: "Official listing on CoinMarketCap and CoinGecko",
      status: "upcoming",
      icon: BarChart,
    },
    {
      date: "MAR 2026",
      title: "E-COMMERCE",
      description: "Launch official merchandise and utility store",
      status: "upcoming",
      icon: ShoppingBag,
    },
  ]

  return (
    <section id="roadmap" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-secondary/30 mb-6">
            <span className="text-sm font-medium text-secondary">Our Journey</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Project <span className="text-secondary neon-text-pink">Roadmap</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Follow our journey as we build the future of decentralized finance. Each milestone brings us closer to
            revolutionizing the blockchain ecosystem.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line - Glowing */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent md:transform md:-translate-x-0.5 opacity-50" />

          <div className="space-y-6">
            {roadmapItems.map((item, index) => (
              <div key={index} className="relative">
                {/* Timeline dot with glow */}
                <div className={`absolute left-6 md:left-1/2 w-4 h-4 rounded-full transform -translate-x-2 md:-translate-x-2 top-8 z-10 ${
                  item.status === "current" 
                    ? "bg-primary animate-pulse-glow" 
                    : "bg-muted border-2 border-primary/50"
                }`} />

                <div className={`ml-14 md:ml-0 ${index % 2 === 0 ? "md:mr-[50%] md:pr-8" : "md:ml-[50%] md:pl-8"}`}>
                  <Card className={`glass-card border transition-all duration-300 hover:scale-[1.02] ${
                    item.status === "current" 
                      ? "border-primary/50 neon-border" 
                      : "border-border/50 hover:border-primary/30"
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          item.status === "current" ? "bg-primary/20" : "bg-muted/50"
                        }`}>
                          <item.icon size={24} className={item.status === "current" ? "text-primary" : "text-muted-foreground"} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Calendar size={14} className="text-primary" />
                            <span className="text-sm font-medium text-primary">{item.date}</span>
                            {item.status === "current" && (
                              <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full border border-primary/30 animate-pulse">
                                Active
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                          <p className="text-muted-foreground text-sm text-pretty">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-8 text-pretty max-w-xl mx-auto">
                Join our community to receive the latest updates on our roadmap progress and upcoming milestones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-primary/20 text-primary border border-primary/50 rounded-xl hover:bg-primary/30 transition-all neon-border font-semibold">
                  Join Telegram
                </button>
                <button className="px-8 py-4 border border-secondary/50 text-secondary rounded-xl hover:bg-secondary/10 transition-all font-semibold">
                  Follow Twitter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
