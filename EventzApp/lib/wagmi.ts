import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet, arbitrum, polygon, base } from "wagmi/chains"

// Get WalletConnect Project ID from https://cloud.reown.com or https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set")
}

// Create Wagmi Config with RainbowKit
export const config = getDefaultConfig({
  appName: "Eventz",
  projectId,
  chains: [mainnet, arbitrum, polygon, base],
  ssr: true,
})
