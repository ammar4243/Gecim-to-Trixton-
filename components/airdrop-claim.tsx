"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Coins, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { getAirdropContract } from "@/lib/web3"

export function AirdropClaim() {
  const { isConnected, address, signer } = useWallet()
  const [loading, setLoading] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [error, setError] = useState("")
  const [txHash, setTxHash] = useState("")
  const [alreadyClaimed, setAlreadyClaimed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkClaimStatus = async () => {
      if (!signer || !address) {
        setChecking(false)
        return
      }
      try {
        console.log("[v0] Checking claim status for:", address)
        const contract = getAirdropContract(signer)
        const hasClaimedAlready = await contract.hasClaimed(address)
        console.log("[v0] Has claimed:", hasClaimedAlready)
        setAlreadyClaimed(hasClaimedAlready)
      } catch (err) {
        console.error("[v0] Error checking claim status:", err)
        setError("Failed to check claim status")
      } finally {
        setChecking(false)
      }
    }

    checkClaimStatus()
  }, [signer, address])

  const handleClaim = async () => {
    if (!signer || !address) {
      setError("Please connect your wallet first")
      return
    }

    setLoading(true)
    setError("")
    setClaimed(false)
    setTxHash("")

    try {
      console.log("[v0] Starting claim transaction...")
      const contract = getAirdropContract(signer)

      const hasClaimedAlready = await contract.hasClaimed(address)
      if (hasClaimedAlready) {
        setError("You have already claimed your airdrop!")
        setAlreadyClaimed(true)
        setLoading(false)
        return
      }

      const polFee = await contract.POL_FEE()
      const tx = await contract.claim({ value: polFee })
      console.log("[v0] Transaction sent:", tx.hash)
      setTxHash(tx.hash)

      const receipt = await tx.wait()
      console.log("[v0] Transaction confirmed:", receipt?.hash)
      setClaimed(true)
      setAlreadyClaimed(true)
    } catch (err: any) {
      console.error("[v0] Claim error:", err)
      if (err.reason) {
        setError(err.reason)
      } else if (err.message.includes("already claimed")) {
        setError("You have already claimed your airdrop!")
        setAlreadyClaimed(true)
      } else if (err.code === "INSUFFICIENT_FUNDS") {
        setError("Insufficient POL for claim fee")
      } else {
        setError(err.message || "Failed to claim airdrop. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Checking your claim status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="text-center mb-8">
          <Coins className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Claim Your Airdrop</h2>
          <p className="text-muted-foreground">2000 TIN Tokens waiting for you</p>
        </div>

        {!isConnected ? (
          <div className="bg-accent/10 border border-accent rounded-lg p-4 text-center mb-6">
            <AlertCircle className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="text-sm text-foreground">Please connect your wallet to claim</p>
          </div>
        ) : (
          <>
            <div className="bg-primary/10 border border-primary rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Your Wallet Address</p>
              <p className="text-sm font-mono text-foreground break-all">{address}</p>
            </div>

            {claimed && (
              <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="font-semibold text-green-500">Claim Successful!</p>
                </div>
                <p className="text-sm text-foreground mb-3">You have successfully claimed 2000 TIN tokens!</p>
                {txHash && (
                  <a
                    href={`https://polygonscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View Transaction →
                  </a>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="font-semibold text-red-500">Error</p>
                </div>
                <p className="text-sm text-foreground">{error}</p>
              </div>
            )}

            <Button
              onClick={handleClaim}
              disabled={loading || alreadyClaimed || claimed}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 rounded-lg transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Claiming...
                </>
              ) : alreadyClaimed || claimed ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Already Claimed
                </>
              ) : (
                <>
                  <Coins className="w-5 h-5 mr-2" />
                  Claim 2000 TIN Tokens
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Each wallet address can only claim once. Make sure you're on the Polygon network.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
