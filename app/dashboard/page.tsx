"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { createClient } from "@/lib/supabase/client"
import {
  Eye,
  UtensilsCrossed,
  QrCode,
  Plus,
  ArrowRight,
} from "lucide-react"

type MenuRow = {
  id: string
  name: string
  description: string | null
  is_published: boolean
  views: number
  created_at: string
}

export default function DashboardPage() {
  const [menus, setMenus] = useState<MenuRow[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email || "User")
      }
      const { data } = await supabase
        .from("menus")
        .select("*")
        .order("created_at", { ascending: false })
      setMenus(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const totalViews = menus.reduce((sum, m) => sum + (m.views || 0), 0)
  const publishedCount = menus.filter((m) => m.is_published).length

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Dashboard" />
      <div className="flex-1 p-4 lg:p-8">
        {/* Welcome */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {userName.split(" ")[0] || "there"}
            </h2>
            <p className="mt-1 text-muted-foreground">
              {"Here's what's happening with your menus today."}
            </p>
          </div>
          <Link href="/dashboard/menus/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Menu
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Menus</p>
                <p className="text-2xl font-bold text-foreground">{loading ? "-" : menus.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-foreground">{loading ? "-" : publishedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-foreground">{loading ? "-" : totalViews}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
            <CardContent className="flex items-center justify-center p-5 h-full">
              <Link href="/dashboard/menus/new">
                <Button variant="ghost" className="gap-2 text-primary hover:text-primary">
                  <Plus className="h-5 w-5" />
                  Create New Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Menus */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Recent Menus</CardTitle>
            <Link href="/dashboard/menus">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
            ) : menus.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <UtensilsCrossed className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No menus yet. Create your first digital menu!</p>
                <Link href="/dashboard/menus/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Create Menu
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {menus.slice(0, 5).map((menu) => (
                  <Link
                    key={menu.id}
                    href={`/dashboard/menus/${menu.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">{menu.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {menu.description || "No description"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        menu.is_published
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {menu.is_published ? "Published" : "Draft"}
                      </span>
                      <span className="text-sm text-muted-foreground">{menu.views || 0} views</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
