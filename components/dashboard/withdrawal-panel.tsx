"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowDownToLine, CheckCircle, AlertCircle, Users, Globe } from "lucide-react"
import { useContractData } from "@/hooks/use-contract-data"
import { useWallet } from "@/hooks/use-wallet"

export function WithdrawalPanel() {
  const [isClaimingReferral, setIsClaimingReferral] = useState(false)
  const [isClaimingGlobal, setIsClaimingGlobal] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" })
  
  const { userStats, referralData, loading, claimReferralRewards, claimGlobalPoolReward, refetch } = useContractData()
  const { address } = useWallet()

  const pendingReferralRewards = referralData?.pendingRewards || 0
  const globalPoolReward = userStats?.globalPoolReward || 0
  const totalAvailable = pendingReferralRewards + globalPoolReward

  const handleClaimReferralRewards = async () => {
    if (!address || pendingReferralRewards <= 0 || !claimReferralRewards) return

    setIsClaimingReferral(true)
    setStatus({ type: "idle", message: "" })

    try {
      await claimReferralRewards()
      setStatus({ type: "success", message: "Referral rewards claimed successfully!" })
      await refetch()
    } catch (error) {
      console.error("[v0] Referral rewards claim failed:", error)
      setStatus({ 
        type: "error", 
        message: error instanceof Error ? error.message : "Failed to claim referral rewards" 
      })
    } finally {
      setIsClaimingReferral(false)
    }
  }

  const handleClaimGlobalPool = async () => {
    if (!address || globalPoolReward <= 0 || !claimGlobalPoolReward) return

    setIsClaimingGlobal(true)
    setStatus({ type: "idle", message: "" })

    try {
      await claimGlobalPoolReward()
      setStatus({ type: "success", message: "Global pool reward claimed successfully!" })
      await refetch()
    } catch (error) {
      console.error("[v0] Global pool claim failed:", error)
      setStatus({ 
        type: "error", 
        message: error instanceof Error ? error.message : "Failed to claim global pool reward" 
      })
    } finally {
      setIsClaimingGlobal(false)
    }
  }

  if (loading) {
    return (
      <Card className="glass-card border border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <Wallet className="text-accent" size={24} />
            </div>
            Withdraw Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading withdrawal data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border border-accent/30 hover:border-accent/50 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
            <Wallet className="text-accent" size={24} />
          </div>
          Withdraw Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Available */}
        <div className="glass-card rounded-xl p-4 border border-accent/20 text-center">
          <div className="text-sm text-muted-foreground mb-1">Total Available</div>
          <div className="text-3xl font-bold text-accent">${totalAvailable.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground mt-1">USDT</div>
        </div>

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
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            )}
            <span className="text-sm">{status.message}</span>
          </div>
        )}

        {/* Referral Rewards */}
        <div className="glass-card rounded-xl p-4 border border-secondary/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={14} />
                <span>Referral Rewards</span>
              </div>
              <div className="text-xl font-bold text-secondary mt-1">
                ${pendingReferralRewards.toFixed(2)}
              </div>
            </div>
          </div>
          <Button
            className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 py-4 rounded-xl"
            onClick={handleClaimReferralRewards}
            disabled={!address || pendingReferralRewards <= 0 || isClaimingReferral}
          >
            <ArrowDownToLine size={16} className="mr-2" />
            {isClaimingReferral ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                Claiming...
              </span>
            ) : pendingReferralRewards <= 0 ? (
              "No Referral Rewards"
            ) : (
              `Claim $${pendingReferralRewards.toFixed(2)}`
            )}
          </Button>
        </div>

        {/* Global Pool Rewards */}
        <div className="glass-card rounded-xl p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe size={14} />
                <span>Global Pool</span>
              </div>
              <div className="text-xl font-bold text-primary mt-1">
                ${globalPoolReward.toFixed(2)}
              </div>
            </div>
          </div>
          <Button
            className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 py-4 rounded-xl"
            onClick={handleClaimGlobalPool}
            disabled={!address || globalPoolReward <= 0 || isClaimingGlobal}
          >
            <ArrowDownToLine size={16} className="mr-2" />
            {isClaimingGlobal ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Claiming...
              </span>
            ) : globalPoolReward <= 0 ? (
              "No Global Pool Reward"
            ) : (
              `Claim $${globalPoolReward.toFixed(2)}`
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>* Referral rewards are earned from your network</p>
          <p>* Global pool rewards are shared among eligible members</p>
        </div>
      </CardContent>
    </Card>
  )
}
