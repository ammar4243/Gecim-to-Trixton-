"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Copy, Share2, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import { useContractData } from "@/hooks/use-contract-data"
import { useWallet } from "@/hooks/use-wallet"
import { useReferral } from "@/hooks/use-referral"

export function ReferralSystem() {
  const { address } = useWallet()
  const { referralData, loading, claimReferralRewards } = useContractData()
  const { generateReferralLink } = useReferral()
  const [referralLink, setReferralLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" })

  useEffect(() => {
    if (address) {
      const link = generateReferralLink(address)
      setReferralLink(link)
    }
  }, [address, generateReferralLink])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy referral link:", err)
    }
  }

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join GECIM Token",
          text: "Join me on GECIM Token and earn rewards!",
          url: referralLink,
        })
      } catch (err) {
        console.log("Share cancelled or failed:", err)
      }
    } else {
      copyToClipboard()
    }
  }

  const handleClaimRewards = async () => {
    if (!claimReferralRewards) return

    setIsClaiming(true)
    setStatus({ type: "idle", message: "" })
    try {
      await claimReferralRewards()
      setStatus({ type: "success", message: "Referral rewards claimed successfully!" })
    } catch (error) {
      console.error("[v0] Referral claim error:", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to claim rewards" })
    } finally {
      setIsClaiming(false)
    }
  }

  if (loading) {
    return (
      <Card className="glass-card border border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Users className="text-primary" size={24} />
            </div>
            Referral System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading referral data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!address) {
    return (
      <Card className="glass-card border border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Users className="text-primary" size={24} />
            </div>
            Referral System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect your wallet to access referral system</p>
        </CardContent>
      </Card>
    )
  }

  const pendingRewards = referralData?.pendingRewards || 0
  const totalReferrals = referralData?.referralCount || 0

  return (
    <Card className="glass-card border border-primary/30 hover:border-primary/50 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Users className="text-primary" size={24} />
          </div>
          Referral System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Message */}
        {status.type !== "idle" && (
          <div
            className={`flex items-start gap-2 p-3 rounded-lg ${
              status.type === "success"
                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm">{status.message}</span>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-4 text-center border border-secondary/20">
            <div className="flex items-center justify-center gap-1 mb-2">
              <DollarSign size={16} className="text-secondary" />
            </div>
            <p className="text-2xl font-bold text-secondary neon-text-pink">${pendingRewards.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mb-3">Pending Rewards</p>
            <Button
              size="sm"
              className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 rounded-lg"
              onClick={handleClaimRewards}
              disabled={isClaiming || pendingRewards <= 0}
            >
              {isClaiming ? "Claiming..." : "Claim Rewards"}
            </Button>
          </div>
          <div className="glass-card rounded-xl p-4 text-center border border-primary/20">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Users size={16} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary neon-text">{totalReferrals}</p>
            <p className="text-xs text-muted-foreground">Direct Referrals</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Referral Link</label>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="text-xs" />
            <Button size="sm" onClick={copyToClipboard} variant={copied ? "default" : "outline"}>
              <Copy size={14} />
              {copied && <span className="ml-1 text-xs">Copied!</span>}
            </Button>
            <Button size="sm" variant="outline" onClick={shareReferralLink}>
              <Share2 size={14} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Share this link to earn commissions when people invest through your referral
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
