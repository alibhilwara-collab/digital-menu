"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Save, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: "", restaurant: "", email: "", phone: "", plan: "Free" })
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile({
        name: p?.full_name || user.user_metadata?.full_name || "",
        restaurant: p?.restaurant_name || user.user_metadata?.restaurant_name || "",
        email: user.email || "",
        phone: p?.phone || "",
        plan: "Free",
      })
    }
    load()
  }, [])

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not logged in")

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: profile.name, restaurant_name: profile.restaurant, phone: profile.phone })
        .eq("id", user.id)
      if (error) throw error
      toast.success("Profile updated successfully!")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const newPw = (form.elements.namedItem("new-pw") as HTMLInputElement).value
    const confirmPw = (form.elements.namedItem("confirm-pw") as HTMLInputElement).value
    if (newPw.length < 6) { toast.error("Password must be at least 6 characters"); return }
    if (newPw !== confirmPw) { toast.error("Passwords don't match"); return }
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) { toast.error(error.message); return }
    toast.success("Password changed successfully!")
    form.reset()
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Settings" />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-6">
          {/* Profile */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base text-foreground">Profile Information</CardTitle>
                  <CardDescription>Update your personal and restaurant details</CardDescription>
                </div>
                <Badge className="bg-primary text-primary-foreground">{profile.plan}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="restaurant">Restaurant Name</Label>
                    <Input
                      id="restaurant"
                      value={profile.restaurant}
                      onChange={(e) => setProfile({ ...profile, restaurant: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2" disabled={saving}>
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-pw">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-pw"
                      type={showCurrentPw ? "text" : "password"}
                      placeholder="Enter current password"
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      aria-label={showCurrentPw ? "Hide password" : "Show password"}
                    >
                      {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-pw">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-pw"
                      type={showNewPw ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPw(!showNewPw)}
                      aria-label={showNewPw ? "Hide password" : "Show password"}
                    >
                      {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-pw">Confirm New Password</Label>
                  <Input
                    id="confirm-pw"
                    type="password"
                    placeholder="Confirm new password"
                    className="h-11"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Delete Account</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                  onClick={() => toast.error("This is a demo. Account deletion is disabled.")}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
