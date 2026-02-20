"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Plus, Eye, Pencil, QrCode, Trash2 } from "lucide-react"
import { toast } from "sonner"

type MenuRow = {
  id: string
  name: string
  description: string | null
  cover_image: string | null
  is_published: boolean
  views: number
  created_at: string
}

export default function MenusPage() {
  const [menus, setMenus] = useState<MenuRow[]>([])
  const [loading, setLoading] = useState(true)

  async function loadMenus() {
    const supabase = createClient()
    const { data } = await supabase
      .from("menus")
      .select("*")
      .order("created_at", { ascending: false })
    setMenus(data || [])
    setLoading(false)
  }

  useEffect(() => { loadMenus() }, [])

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this menu?")) return
    const supabase = createClient()
    const { error } = await supabase.from("menus").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete menu")
      return
    }
    toast.success("Menu deleted")
    setMenus((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="My Menus" />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">All Menus</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and edit your restaurant menus
            </p>
          </div>
          <Link href="/dashboard/menus/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Menu
            </Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading menus...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu) => (
              <Card key={menu.id} className="group overflow-hidden border-border transition-shadow hover:shadow-lg">
                <div className="relative h-40 overflow-hidden bg-muted">
                  {menu.cover_image ? (
                    <img
                      src={menu.cover_image}
                      alt={menu.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl font-bold text-muted-foreground/20">{menu.name.charAt(0)}</span>
                    </div>
                  )}
                  <Badge
                    variant={menu.is_published ? "default" : "secondary"}
                    className="absolute top-3 right-3 text-xs"
                  >
                    {menu.is_published ? "Live" : "Draft"}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-foreground">{menu.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {menu.description || "No description"}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {menu.views || 0} views
                    </span>
                    <span>
                      {new Date(menu.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Link href={`/dashboard/menus/${menu.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-1.5">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/menu/${menu.id}`}>
                      <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Preview menu">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Link href="/dashboard/qr">
                      <Button variant="outline" size="icon" className="h-8 w-8" aria-label="QR code">
                        <QrCode className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(menu.id)}
                      aria-label="Delete menu"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Create new card */}
            <Link href="/dashboard/menus/new">
              <Card className="flex h-full min-h-[320px] cursor-pointer items-center justify-center border-2 border-dashed border-border transition-colors hover:border-primary hover:bg-primary/5">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground">Create New Menu</p>
                  <p className="mt-1 text-sm text-muted-foreground">Add a new restaurant menu</p>
                </div>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
