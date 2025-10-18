"use client"

import { useState, useEffect } from "react"
import { getUsers, createUser, updateUser, deleteUser, type User } from "@/lib/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Save, X, Mail, UserIcon } from "lucide-react"

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    setUsers(getUsers())
  }

  const handleCreate = () => {
    if (!formData.username || !formData.password || !formData.email) {
      alert("Please fill in all fields")
      return
    }

    try {
      createUser(formData)
      loadUsers()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create user")
    }
  }

  const handleUpdate = () => {
    if (!editingUser || !formData.username || !formData.email) {
      alert("Please fill in required fields")
      return
    }

    try {
      const updates: Partial<Omit<User, "id" | "createdAt">> = {
        username: formData.username,
        email: formData.email,
      }

      if (formData.password) {
        updates.password = formData.password
      }

      updateUser(editingUser.id, updates)
      loadUsers()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update user")
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        deleteUser(id)
        loadUsers()
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to delete user")
      }
    }
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: "",
      email: user.email,
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingUser(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
    })
    setEditingUser(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-muted-foreground">Manage admin users who can access this dashboard</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
              <DialogDescription>
                {editingUser ? "Update user credentials and information" : "Add a new admin user"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password {editingUser && "(leave blank to keep current)"}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={editingUser ? "••••••••" : "Enter password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={editingUser ? handleUpdate : handleCreate} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {editingUser ? "Update" : "Create"}
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
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    {user.username}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Created: {new Date(user.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
