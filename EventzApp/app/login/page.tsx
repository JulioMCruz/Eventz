"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { useAppKit } from "@reown/appkit/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowRight } from "lucide-react"
import { useWalletAuth } from "@/lib/web3-auth"

export default function LoginPage() {
  const router = useRouter()
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { authenticateWallet, isAuthenticated } = useWalletAuth()

  useEffect(() => {
    const authenticate = async () => {
      if (isConnected && address) {
        const user = await authenticateWallet()
        if (user && isAuthenticated()) {
          router.push("/admin")
        }
      }
    }

    authenticate()
  }, [isConnected, address, router])

  const handleConnect = () => {
    open()
  }

  if (isConnected && address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Wallet Connected</CardTitle>
            <CardDescription>Authenticating your wallet...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm text-muted-foreground text-center break-all">{address}</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Connect your wallet to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button onClick={handleConnect} className="w-full" size="lg">
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Supported Wallets</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium">MetaMask</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium">WalletConnect</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium">Coinbase</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium">Others</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> Only wallet addresses registered as admin can access the dashboard.
              </p>
            </div>

            <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
              Back to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
