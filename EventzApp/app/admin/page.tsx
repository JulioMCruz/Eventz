"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { isAuthenticated, logout } from "@/lib/auth"
import { isAdminWallet } from "@/lib/admin-check"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Calendar, Users, AlertCircle } from "lucide-react"
import Link from "next/link"
import { EventsManager } from "@/components/admin/events-manager"
import { UsersManager } from "@/components/admin/users-manager"

export default function AdminPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const { address, isConnected } = useAccount()
  const isAdmin = isAdminWallet(address)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    } else if (isConnected && !isAdmin) {
      // User is authenticated but not an admin
      setIsChecking(false)
    } else {
      setIsChecking(false)
    }
  }, [router, isConnected, isAdmin])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show access denied for non-admin users
  if (isConnected && !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-background rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard. Only authorized admin wallets can access this area.
          </p>
          <div className="space-y-2">
            <Button onClick={() => router.push("/events")} className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Go to Events
            </Button>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <nav className="flex items-center gap-1">
            <Link href="/events">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Events
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                Admin
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventsManager />
          </TabsContent>

          <TabsContent value="users">
            <UsersManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
