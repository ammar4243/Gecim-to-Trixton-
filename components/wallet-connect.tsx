"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet, LogOut, AlertCircle } from "lucide-react"

export function WalletConnect() {
  const { address, isConnecting, connect, disconnect, isConnected, error } = useWallet()

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl border border-accent/30">
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        <span className="text-sm font-mono text-foreground">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnect}
          className="border-destructive/50 text-destructive hover:bg-destructive/10 h-8 w-8 p-0 bg-transparent"
        >
          <LogOut size={14} />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={connect}
        disabled={isConnecting}
        className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 rounded-xl neon-border"
      >
        <Wallet size={16} />
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Connecting...
          </span>
        ) : (
          "Connect Wallet"
        )}
      </Button>
      {error && (
        <div className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
