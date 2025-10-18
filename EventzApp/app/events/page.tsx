"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getEvents, type RedirectConfig } from "@/lib/config"
import { logout } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, Clock, Star, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function DashboardPage() {
  const [events, setEvents] = useState<RedirectConfig[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setEvents(getEvents())
    setLoading(false)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Events Dashboard</h1>
                <p className="text-sm text-slate-600">Browse all available events</p>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/events" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Events
              </Link>
              <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Admin
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Events Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-slate-600">
            {events.length} {events.length === 1 ? "event" : "events"} available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
              {/* Event Image */}
              <div className="relative h-48 bg-slate-200">
                <Image src={event.heroImage || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                {event.isDefault && (
                  <Badge className="absolute top-3 right-3 bg-blue-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-slate-900">{event.name}</CardTitle>
                    <CardDescription className="mt-1 text-slate-600">{event.heroSlogan}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Hero Title */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{event.heroTitle}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3">{event.heroText}</p>
                </div>

                {/* Event Details */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ExternalLink className="h-4 w-4" />
                    <span className="truncate">{event.redirectUrl}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {event.redirectMode === "auto"
                        ? `Auto redirect in ${event.autoRedirectDelay}s`
                        : "Manual redirect"}
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="pt-4 border-t text-xs text-slate-500">
                  <p>
                    Updated:{" "}
                    {new Date(event.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No events found</h3>
            <p className="text-slate-600">There are no events available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  )
}
