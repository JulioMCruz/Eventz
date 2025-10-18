"use client"

import { useAppKit } from "@reown/appkit/react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { useEffect } from "react"
import { useWalletAuth } from "@/lib/web3-auth"

export function WalletConnectButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { authenticateWallet, logout, isAuthenticated } = useWalletAuth()

  useEffect(() => {
    if (isConnected && address && !isAuthenticated()) {
      authenticateWallet()
    }
  }, [isConnected, address])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:inline">{formatAddress(address)}</span>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button variant="default" size="sm" onClick={() => open()}>
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  )
}
