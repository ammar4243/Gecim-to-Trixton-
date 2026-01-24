"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coins, DollarSign, AlertTriangle, CheckCircle, Hexagon } from "lucide-react"
import { useContractData } from "@/hooks/use-contract-data"
import { useWallet } from "@/hooks/use-wallet"
import { useReferral } from "@/hooks/use-referral"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, USDT_ADDRESS } from "@/lib/web3"

export function TokenPurchase() {
  const [referralAddress, setReferralAddress] = useState("")
  const [usdtBalance, setUsdtBalance] = useState("0")
  const [usdtAllowance, setUsdtAllowance] = useState("0")
  const [isApproving, setIsApproving] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" })

  const { presaleData, userStats, loading, invest, refetch } = useContractData()
  const { address, provider, isConnected } = useWallet()
  const { referralAddress: contextReferralAddress } = useReferral()

  const INVESTMENT_AMOUNT = presaleData?.investmentAmount || 100
  const TOKEN_PRICE = presaleData?.tokenPrice || 0.4  // $0.40 per GCM
  const TOKENS_RECEIVED = INVESTMENT_AMOUNT / TOKEN_PRICE  // 100 / 0.4 = 250 GCM

  const checkUsdtBalanceAndAllowance = async () => {
    if (!address || !provider) return

    try {
      const usdtAbi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function allowance(address owner, address spender) view returns (uint256)",
      ]

      const usdtContract = new ethers.Contract(USDT_ADDRESS, usdtAbi, provider)

      try {
        const balance = await usdtContract.balanceOf(address)
        setUsdtBalance(ethers.formatUnits(balance, 6))
        console.log("[v0] USDT Balance:", ethers.formatUnits(balance, 6))
      } catch (balanceError) {
        console.log("[v0] Could not fetch USDT balance (may be wrong chain or address):", balanceError)
        setUsdtBalance("0")
      }

      try {
        const allowance = await usdtContract.allowance(address, CONTRACT_ADDRESS)
        setUsdtAllowance(ethers.formatUnits(allowance, 6))
        console.log("[v0] USDT Allowance:", ethers.formatUnits(allowance, 6))
      } catch (allowanceError) {
        console.log("[v0] Could not fetch USDT allowance:", allowanceError)
        setUsdtAllowance("0")
      }
    } catch (error) {
      console.log("[v0] Error checking USDT balance - using fallback:", error)
      setUsdtBalance("0")
      setUsdtAllowance("0")
    }
  }

  const handleApprove = async () => {
    if (!provider || !address) return

    try {
      setIsApproving(true)
      setStatus({ type: "idle", message: "" })
      console.log("[v0] Approval started for USDT amount:", INVESTMENT_AMOUNT)

      const usdtAbi = ["function approve(address spender, uint256 amount) returns (bool)"]
      const signer = await provider.getSigner()
      const usdtContract = new ethers.Contract(USDT_ADDRESS, usdtAbi, signer)

      const usdtInWei = ethers.parseUnits(INVESTMENT_AMOUNT.toString(), 6)
      console.log("[v0] Approving USDT amount (wei):", usdtInWei.toString())
      
      const tx = await usdtContract.approve(CONTRACT_ADDRESS, usdtInWei)
      console.log("[v0] Approve transaction hash:", tx.hash)
      
      await tx.wait()
      console.log("[v0] Approval confirmed")

      await checkUsdtBalanceAndAllowance()
      setStatus({ type: "success", message: "USDT approved successfully! Now you can invest." })
    } catch (error) {
      console.error("[v0] Approval failed:", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to approve USDT" })
    } finally {
      setIsApproving(false)
    }
  }

  const handlePurchase = async () => {
    if (!invest || !address) return

    try {
      setIsPurchasing(true)
      setStatus({ type: "idle", message: "" })
      console.log("[v0] Investment started from address:", address)

      const referrer = referralAddress && ethers.isAddress(referralAddress)
        ? referralAddress
        : ethers.ZeroAddress

      console.log("[v0] Using referrer:", referrer)
      await invest(referrer)
      console.log("[v0] Investment successful")

      setReferralAddress("")
      await refetch()
      await checkUsdtBalanceAndAllowance()

      setStatus({ type: "success", message: "Investment successful! Your GCM tokens have been credited." })
    } catch (error) {
      console.error("[v0] Purchase failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Investment failed. Please try again."
      setStatus({ type: "error", message: errorMessage })
    } finally {
      setIsPurchasing(false)
    }
  }

  useEffect(() => {
    if (address && provider) {
      checkUsdtBalanceAndAllowance()
    }
  }, [address, provider])

  useEffect(() => {
    if (contextReferralAddress && !referralAddress) {
      setReferralAddress(contextReferralAddress)
    }
  }, [contextReferralAddress, referralAddress])

  if (loading) {
    return (
      <Card className="glass-card border border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="text-primary" size={24} />
            Invest in <span className="text-primary neon-text">GECIM</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Check if user already invested
  if (userStats?.hasInvested) {
    return (
      <Card className="glass-card border border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-primary" size={24} />
            </div>
            <span>Already Invested</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="glass-card rounded-xl p-6 border border-primary/20 text-center">
            <Hexagon className="w-16 h-16 text-primary mx-auto mb-4" fill="currentColor" fillOpacity={0.1} />
            <h3 className="text-xl font-bold text-foreground mb-2">Thank you for investing!</h3>
            <p className="text-muted-foreground mb-4">
              You have already invested ${userStats.totalInvestment} USDT in GECIM.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="glass-card px-4 py-2 rounded-lg border border-primary/20">
                <div className="text-muted-foreground">GCM Tokens</div>
                <div className="font-bold text-primary">{userStats.gcmBalance.toLocaleString()}</div>
              </div>
              <div className="glass-card px-4 py-2 rounded-lg border border-accent/20">
                <div className="text-muted-foreground">Your Level</div>
                <div className="font-bold text-accent">Level {userStats.userLevel}</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Share your referral link to earn rewards and increase your level!
          </p>
        </CardContent>
      </Card>
    )
  }

  const hasInsufficientBalance = Number(usdtBalance) < INVESTMENT_AMOUNT
  const needsApproval = Number(usdtAllowance) < INVESTMENT_AMOUNT
  // Allow purchase regardless of balance - only require wallet connection and approval
  const canPurchase = !needsApproval && address

  return (
    <Card className="glass-card border border-primary/30 hover:border-primary/50 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Coins className="text-primary" size={24} />
          </div>
          <span>Invest in <span className="text-primary neon-text">GECIM</span></span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* USDT Balance */}
        {address && (
          <div className="glass-card rounded-lg p-4 border border-muted/20">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Your USDT Balance:</span>
              <span className="text-lg font-bold">{Number(usdtBalance).toFixed(2)} USDT</span>
            </div>
          </div>
        )}

        {/* Alerts */}
        {hasInsufficientBalance && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Insufficient USDT balance. You need {INVESTMENT_AMOUNT} USDT.
            </AlertDescription>
          </Alert>
        )}

        {needsApproval && !hasInsufficientBalance && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need to approve USDT spending before investing.
            </AlertDescription>
          </Alert>
        )}

        {status.type !== "idle" && (
          <Alert className={status.type === "success" ? "border-green-500/30 bg-green-500/10" : ""}>
            {status.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription className={status.type === "success" ? "text-green-400" : ""}>
              {status.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Investment Package */}
        <div className="glass-card rounded-xl p-6 border border-primary/30 neon-border">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-4">
              <DollarSign size={20} className="text-primary" />
              <span className="font-bold text-primary">Standard Package</span>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">${INVESTMENT_AMOUNT} USDT</div>
            <p className="text-muted-foreground">One-time investment</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-muted/20">
              <span className="text-muted-foreground">GCM Tokens</span>
              <span className="font-bold text-primary">{TOKENS_RECEIVED.toLocaleString()} GCM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-muted/20">
              <span className="text-muted-foreground">Token Price</span>
              <span className="font-medium">${TOKEN_PRICE.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Referral Bonus</span>
              <span className="font-medium text-accent">Up to 10 Levels</span>
            </div>
          </div>
        </div>

        {/* Referral Input */}
        <div className="space-y-2">
          <Label htmlFor="referral">Referral Address (Optional)</Label>
          <Input
            id="referral"
            placeholder="0x..."
            value={referralAddress}
            onChange={(e) => setReferralAddress(e.target.value)}
            className="bg-muted/20 border-muted/30"
          />
          {contextReferralAddress && (
            <p className="text-xs text-green-400">Referral address auto-filled from your link</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isConnected ? (
            <Button className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 text-lg py-6 rounded-xl neon-border" disabled>
              Connect Wallet First
            </Button>
          ) : needsApproval ? (
            <Button
              className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 text-lg py-6 rounded-xl"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                  Approving...
                </span>
              ) : (
                `Approve ${INVESTMENT_AMOUNT} USDT`
              )}
            </Button>
          ) : (
            <Button
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 text-lg py-6 rounded-xl neon-border animate-pulse-glow"
              onClick={handlePurchase}
              disabled={!canPurchase || isPurchasing}
            >
              {isPurchasing ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                `Invest $${INVESTMENT_AMOUNT} USDT`
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
