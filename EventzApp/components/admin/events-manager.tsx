"use client"

import { useState, useEffect } from "react"
import { getEvents, createEvent, updateEvent, deleteEvent, setDefaultEvent, type RedirectConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Star, Save, X, Eye } from "lucide-react"

export function EventsManager() {
  const [events, setEvents] = useState<RedirectConfig[]>([])
  const [editingEvent, setEditingEvent] = useState<RedirectConfig | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<RedirectConfig>>({
    name: "",
    redirectUrl: "",
    redirectMode: "manual",
    autoRedirectDelay: 5,
    heroImage: "/professional-business-meeting.png",
    heroTitle: "",
    heroText: "",
    heroSlogan: "",
    isDefault: false,
  })

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = () => {
    setEvents(getEvents())
  }

  const handleCreate = () => {
    if (!formData.name || !formData.redirectUrl) {
      alert("Please fill in required fields")
      return
    }

    createEvent(formData as Omit<RedirectConfig, "id" | "createdAt" | "updatedAt">)
    loadEvents()
    resetForm()
    setIsDialogOpen(false)
  }

  const handleUpdate = () => {
    if (!editingEvent || !formData.name || !formData.redirectUrl) {
      alert("Please fill in required fields")
      return
    }

    updateEvent(editingEvent.id, formData)
    loadEvents()
    resetForm()
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent(id)
      loadEvents()
    }
  }

  const handleSetDefault = (id: string) => {
    setDefaultEvent(id)
    loadEvents()
  }

  const openEditDialog = (event: RedirectConfig) => {
    setEditingEvent(event)
    setFormData(event)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingEvent(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      redirectUrl: "",
      redirectMode: "manual",
      autoRedirectDelay: 5,
      heroImage: "/professional-business-meeting.png",
      heroTitle: "",
      heroText: "",
      heroSlogan: "",
      isDefault: false,
    })
    setEditingEvent(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Events</h2>
          <p className="text-muted-foreground">
            Manage your event configurations. Only one event is active on the landing page at a time.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
              <DialogDescription>
                {editingEvent ? "Update the event configuration" : "Create a new event configuration"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Campaign"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirectUrl">Redirect URL *</Label>
                <Input
                  id="redirectUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.redirectUrl}
                  onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label>Redirect Mode</Label>
                <RadioGroup
                  value={formData.redirectMode}
                  onValueChange={(value: "auto" | "manual") => setFormData({ ...formData, redirectMode: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual-edit" />
                    <Label htmlFor="manual-edit" className="font-normal cursor-pointer">
                      Manual - User clicks button
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="auto" id="auto-edit" />
                    <Label htmlFor="auto-edit" className="font-normal cursor-pointer">
                      Automatic - Redirect after countdown
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.redirectMode === "auto" && (
                <div className="space-y-2">
                  <Label htmlFor="delay">Auto-redirect Delay (seconds)</Label>
                  <Input
                    id="delay"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.autoRedirectDelay}
                    onChange={(e) =>
                      setFormData({ ...formData, autoRedirectDelay: Number.parseInt(e.target.value) || 5 })
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="heroSlogan">Hero Slogan</Label>
                <Input
                  id="heroSlogan"
                  placeholder="Your Success Starts Here"
                  value={formData.heroSlogan}
                  onChange={(e) => setFormData({ ...formData, heroSlogan: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  placeholder="Welcome to Our Platform"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroText">Hero Description</Label>
                <Textarea
                  id="heroText"
                  placeholder="Discover amazing opportunities..."
                  value={formData.heroText}
                  onChange={(e) => setFormData({ ...formData, heroText: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Image URL</Label>
                <Input
                  id="heroImage"
                  type="url"
                  placeholder="/professional-business-meeting.png"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isDefault" className="font-normal cursor-pointer">
                  Set as active event (displayed on landing page)
                </Label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={editingEvent ? handleUpdate : handleCreate} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {editingEvent ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>{event.name}</CardTitle>
                    {event.isDefault && (
                      <Badge variant="default" className="gap-1">
                        <Star className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{event.redirectUrl}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/preview/${event.id}`, "_blank")}
                    title="Preview event"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {!event.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(event.id)}
                      title="Set as active"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(event)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Mode:</span>{" "}
                  <span className="font-medium capitalize">{event.redirectMode}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Delay:</span>{" "}
                  <span className="font-medium">{event.autoRedirectDelay}s</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Title:</span>{" "}
                  <span className="font-medium">{event.heroTitle || "Not set"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
