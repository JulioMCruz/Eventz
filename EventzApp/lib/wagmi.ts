import { createAppKit } from "@reown/appkit/react"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { mainnet, arbitrum, polygon, base } from "@reown/appkit/networks"
import { cookieStorage, createStorage } from "wagmi"
import { QueryClient } from "@tanstack/react-query"

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set")
}

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, arbitrum, polygon, base],
  projectId,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
})

// Create Query Client
export const queryClient = new QueryClient()

// Create modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, arbitrum, polygon, base],
  projectId,
  metadata: {
    name: "Eventz",
    description: "Event redirect platform with Web3 authentication",
    url: typeof window !== "undefined" ? window.location.origin : "https://eventz.app",
    icons: [typeof window !== "undefined" ? `${window.location.origin}/favicon.ico` : "https://eventz.app/favicon.ico"],
  },
  features: {
    analytics: true,
  },
})

export const config = wagmiAdapter.wagmiConfig
