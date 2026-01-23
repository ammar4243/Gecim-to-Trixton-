import { ethers } from "ethers"
import contractABI from "./contract-abi.json"

export const CONTRACT_ADDRESS = "0x3E71Cc6E3E990eF22c16EA21b2e05cf53479da5e"
export const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" // USDT on Polygon
export const AIRDROP_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" // Replace with actual airdrop contract

// Use the actual contract ABI from Etherscan
export const CONTRACT_ABI = contractABI as any

export const AIRDROP_CONTRACT_ABI = [] // Define the AIRDROP_CONTRACT_ABI here

export async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      return { provider, signer, address }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  } else {
    throw new Error("MetaMask is not installed")
  }
}

export function getContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider)
}

export function getUsdtContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  const USDT_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address to, uint256 amount) external returns (bool)"
  ]
  return new ethers.Contract(USDT_ADDRESS, USDT_ABI, signerOrProvider)
}

export function getAirdropContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AIRDROP_CONTRACT_ABI, signerOrProvider)
}
