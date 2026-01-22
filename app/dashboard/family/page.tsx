"use client"

import { useWallet } from "@/hooks/use-wallet"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { WalletConnect } from "@/components/wallet-connect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Hexagon, Users, GitBranch, DollarSign, Copy, CheckCircle } from "lucide-react"
import { useContractData } from "@/hooks/use-contract-data"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function FamilyPage() {
  const { isConnected, address } = useWallet()
  const { referralData, userStats, loading, claimReferralRewards } = useContractData()
  const [copied, setCopied] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" })

  const referralLink = address ? `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard?ref=${address}` : ""

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClaimRewards = async () => {
    if (!claimReferralRewards) return

    setIsClaiming(true)
    setStatus({ type: "idle", message: "" })

    try {
      await claimReferralRewards()
      setStatus({ type: "success", message: "Referral rewards claimed successfully!" })
    } catch (error) {
      console.error("Failed to claim rewards:", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to claim rewards" })
    } finally {
      setIsClaiming(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <Card className="w-full max-w-md mx-4 glass-card border border-primary/30 neon-border relative z-10">
          <CardContent className="p-8 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-glow" />
              <div className="relative w-full h-full bg-primary/10 rounded-2xl flex items-center justify-center">
                <Wallet size={40} className="text-primary" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Hexagon className="w-6 h-6 text-primary" fill="currentColor" fillOpacity={0.1} />
              <h1 className="text-2xl font-bold text-foreground">
                Connect to <span className="text-primary neon-text">GECIM</span>
              </h1>
            </div>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Please connect your wallet to view your family network.
            </p>
            <WalletConnect />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get referral count from contract data
  const directReferralCount = referralData?.referralCount || 0
  const directReferralRewards = referralData?.pendingRewards || 0
  
  console.log("[v0] Family Page - referralData:", referralData)
  console.log("[v0] Family Page - directReferralCount:", directReferralCount)

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Your <span className="text-primary neon-text">Family</span> Network
            </h1>
            <p className="text-muted-foreground">View your direct referrals and family tree</p>
          </div>

          {/* Status Message */}
          {status.type !== "idle" && (
            <div
              className={`max-w-xl mx-auto flex items-start gap-2 p-4 rounded-lg ${
                status.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/30"
                  : "bg-red-500/10 text-red-400 border border-red-500/30"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          {/* Two Main Boxes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box 1: Direct Referrals */}
            <Card className="glass-card border border-primary/30 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Users className="text-primary" size={24} />
                  </div>
                  <div>
                    <span className="text-xl">Direct Referrals</span>
                    <p className="text-sm text-muted-foreground font-normal">Your Level 1 referrals</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card rounded-xl p-5 text-center border border-primary/20">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-3xl font-bold text-primary neon-text">
                      {loading ? "..." : directReferralCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Count</p>
                  </div>
                  <div className="glass-card rounded-xl p-5 text-center border border-secondary/20">
                    <DollarSign className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <p className="text-3xl font-bold text-secondary neon-text-pink">
                      ${loading ? "..." : directReferralRewards.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending Rewards</p>
                  </div>
                </div>

                {/* Claim Button */}
                {directReferralRewards > 0 && (
                  <Button
                    className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 py-5 rounded-xl"
                    onClick={handleClaimRewards}
                    disabled={isClaiming}
                  >
                    {isClaiming ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                        Claiming...
                      </span>
                    ) : (
                      `Claim $${directReferralRewards.toFixed(2)} Rewards`
                    )}
                  </Button>
                )}

                {/* Direct Referrals List */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Referral List</h4>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : referralData?.directReferrals && referralData.directReferrals.length > 0 ? (
                    <div className="space-y-2 max-h-[250px] overflow-y-auto">
                      {referralData.directReferrals.map((ref, index) => (
                        <div
                          key={ref}
                          className="flex items-center gap-3 p-3 glass-card rounded-xl border border-muted/20"
                        >
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-sm truncate">{ref}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 glass-card rounded-xl border border-muted/20">
                      <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">No direct referrals yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Box 2: Family Tree (Indirect Referrals) */}
            <Card className="glass-card border border-accent/30 hover:border-accent/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <GitBranch className="text-accent" size={24} />
                  </div>
                  <div>
                    <span className="text-xl">Family Tree</span>
                    <p className="text-sm text-muted-foreground font-normal">Your extended network (Levels 2-10)</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visual Family Tree */}
                <div className="relative py-6">
                  <div className="flex flex-col items-center">
                    {/* You (Root) */}
                    <div className="w-20 h-20 bg-primary/20 rounded-full border-2 border-primary flex items-center justify-center neon-border">
                      <Hexagon className="text-primary" size={32} fill="currentColor" fillOpacity={0.2} />
                    </div>
                    <div className="text-sm font-medium mt-2">You</div>
                    <div className="text-xs text-muted-foreground">Level {userStats?.userLevel || 0}</div>

                    {/* Connection Line */}
                    {directReferralCount > 0 && (
                      <>
                        <div className="w-0.5 h-6 bg-gradient-to-b from-primary to-secondary mt-2" />
                        
                        {/* Level 1 Referrals Preview */}
                        <div className="flex flex-wrap justify-center gap-3 mt-2 max-w-sm">
                          {referralData?.directReferrals?.slice(0, 4).map((ref, index) => (
                            <div key={ref} className="flex flex-col items-center">
                              <div className="w-10 h-10 bg-secondary/20 rounded-full border border-secondary/50 flex items-center justify-center">
                                <span className="text-secondary font-bold text-xs">{index + 1}</span>
                              </div>
                            </div>
                          ))}
                          {directReferralCount > 4 && (
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 bg-muted/20 rounded-full border border-muted/50 flex items-center justify-center">
                                <span className="text-muted-foreground text-xs">+{directReferralCount - 4}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Indirect Levels Indicator */}
                        <div className="w-0.5 h-4 bg-gradient-to-b from-secondary to-accent mt-2" />
                        <div className="mt-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/30">
                          <span className="text-xs text-accent">Levels 2-10 Network</span>
                        </div>
                      </>
                    )}
                  </div>

                  {directReferralCount === 0 && (
                    <div className="text-center py-4 mt-4">
                      <GitBranch className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        Your family tree will grow as you invite members
                      </p>
                    </div>
                  )}
                </div>

                {/* Level Distribution */}
                <div className="pt-4 border-t border-muted/20">
                  <h4 className="text-sm font-medium mb-4">Network Levels</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <div
                        key={level}
                        className={`text-center p-2 rounded-lg ${
                          (userStats?.userLevel || 0) >= level
                            ? "bg-primary/20 border border-primary/50"
                            : "bg-muted/10 border border-muted/20"
                        }`}
                      >
                        <div
                          className={`text-lg font-bold ${
                            (userStats?.userLevel || 0) >= level ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {level}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {level === 10 ? "GH" : `Lv${level}`}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Earn commissions from all 10 levels of your network
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link Card */}
          <Card className="glass-card border border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Copy className="text-primary" size={20} />
                </div>
                Your Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1 bg-muted/20 border border-muted/30 rounded-xl p-4 font-mono text-sm text-muted-foreground overflow-hidden">
                  <span className="truncate block">{referralLink}</span>
                </div>
                <Button
                  onClick={copyToClipboard}
                  className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 px-6"
                >
                  {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Share this link to invite friends and earn referral rewards up to 10 levels deep!
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
