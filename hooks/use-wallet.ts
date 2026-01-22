"use client"

import { useState, useEffect } from "react"
import type { ethers } from "ethers"
import { connectWallet, getContract } from "@/lib/web3"

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = async () => {
    setIsConnecting(true)
    setIsReady(false)
    setError(null)
    
    // Check if MetaMask or other wallet is available
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask to connect your wallet")
      setIsConnecting(false)
      return
    }
    
    try {
      const { provider, signer, address } = await connectWallet()

      setProvider(provider)
      setSigner(signer)
      setAddress(address)

      const contractInstance = getContract(signer)
      setContract(contractInstance)

      localStorage.setItem("walletConnected", "true")
      setIsReady(true)
      
      // Redirect to dashboard after successful connection
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setError("Failed to connect wallet. Please try again.")
      setIsReady(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setProvider(null)
    setSigner(null)
    setContract(null)
    setIsReady(false)
    setError(null)
    localStorage.removeItem("walletConnected")
  }

  useEffect(() => {
    const wasConnected = localStorage.getItem("walletConnected")
    if (wasConnected === "true" && typeof window.ethereum !== "undefined") {
      // Auto-reconnect without redirect
      const autoConnect = async () => {
        setIsConnecting(true)
        try {
          const { provider, signer, address } = await connectWallet()
          setProvider(provider)
          setSigner(signer)
          setAddress(address)
          const contractInstance = getContract(signer)
          setContract(contractInstance)
          setIsReady(true)
        } catch (error) {
          console.error("Auto-connect failed:", error)
          localStorage.removeItem("walletConnected")
        } finally {
          setIsConnecting(false)
        }
      }
      autoConnect()
    }
  }, [])

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else if (accounts[0] !== address) {
          setAddress(accounts[0])
          if (signer && provider) {
            const contractInstance = getContract(signer)
            setContract(contractInstance)
            setIsReady(true)
          }
        }
      }

      const handleChainChanged = () => {
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [address, signer, provider])

  return {
    address,
    provider,
    signer,
    contract,
    isConnecting,
    connect,
    disconnect,
    isConnected: !!address,
    isReady: isReady && !!address && !!contract,
    error,
  }
}
