"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Coins, DollarSign, Users } from "lucide-react"
import { useContractData } from "@/hooks/use-contract-data"
import { CONTRACT_ADDRESS } from "@/lib/web3"

export function Presale() {
  const { tokenPrice, totalSupply, presaleSupply, tokensSold, totalRaised, totalInvestors, loading } = useContractData()

  const tokenDetails = [
    { label: "Token Name", value: "Trixton" },
    { label: "Symbol", value: "TIN" },
    { label: "Decimals", value: "18" },
    { label: "Total Supply", value: loading ? "Loading..." : totalSupply?.toLocaleString() },
    { label: "Presale Supply", value: loading ? "Loading..." : presaleSupply?.toLocaleString() },
    { label: "Presale Price", value: loading ? "Loading..." : `$${tokenPrice}` },
  ]

  const progressPercentage = presaleSupply && tokensSold ? Math.round((tokensSold / presaleSupply) * 100) : 0

  return (
    <section id="presale" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">Trixton</span> Presale
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Don't miss your chance to be part of the Trixton revolution. Secure your tokens at the exclusive presale
            price before public launch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Presale Progress */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="text-primary" size={24} />
                Presale Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tokens Sold</span>
                  <span>
                    {loading
                      ? "Loading..."
                      : `${tokensSold?.toLocaleString() || "0"} / ${presaleSupply?.toLocaleString() || "0"}`}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-card rounded-lg">
                  <DollarSign className="text-primary mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? "Loading..." : `$${totalRaised?.toLocaleString() || "0"}`}
                  </div>
                  <div className="text-sm text-muted-foreground">Raised</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg">
                  <Users className="text-primary mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? "Loading..." : totalInvestors?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-muted-foreground">Investors</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Details */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Token Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tokenDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
                  >
                    <span className="text-muted-foreground">{detail.label}</span>
                    <span className="font-semibold text-foreground">{detail.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-3">Buy Tokens Now</Button>
                <Button variant="outline" className="w-full text-lg py-3 bg-transparent">
                  <a
                    href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Smart Contract
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">Presale Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Early Bird Pricing</h4>
              <p className="text-muted-foreground text-pretty">
                Get tokens at the lowest possible price before public launch
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Bonus Rewards</h4>
              <p className="text-muted-foreground text-pretty">Earn additional tokens through our referral program</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">VIP Access</h4>
              <p className="text-muted-foreground text-pretty">
                Exclusive access to future features and premium services
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
