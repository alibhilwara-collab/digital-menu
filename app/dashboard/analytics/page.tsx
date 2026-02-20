"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Eye, TrendingUp, UtensilsCrossed, BarChart3 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type MenuRow = { id: string; name: string; views: number; is_published: boolean }

export default function AnalyticsPage() {
  const [menus, setMenus] = useState<MenuRow[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: menuData } = await supabase
        .from("menus")
        .select("id, name, views, is_published")
        .order("views", { ascending: false })
      setMenus(menuData || [])

      // Count items across all menus
      const { count } = await supabase
        .from("items")
        .select("id", { count: "exact", head: true })
      setItemCount(count || 0)
      setLoading(false)
    }
    load()
  }, [])

  const totalViews = menus.reduce((s, m) => s + (m.views || 0), 0)
  const publishedCount = menus.filter((m) => m.is_published).length
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Analytics" />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Analytics Overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your menu performance and customer engagement
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Views", value: loading ? "-" : totalViews.toLocaleString(), icon: Eye },
            { label: "Published Menus", value: loading ? "-" : publishedCount, icon: TrendingUp },
            { label: "Total Menus", value: loading ? "-" : menus.length, icon: UtensilsCrossed },
            { label: "Total Items", value: loading ? "-" : itemCount, icon: BarChart3 },
          ].map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart: Views per Menu */}
        <div className="mb-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Views per Menu</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-12 text-center text-muted-foreground">Loading chart...</p>
              ) : menus.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No menu data to display yet.</p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={menus.map((m) => ({ name: m.name, views: m.views || 0 }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 75)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: "oklch(0.5 0.015 50)" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "oklch(0.5 0.015 50)" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(1 0 0)",
                          border: "1px solid oklch(0.92 0.004 75)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar
                        dataKey="views"
                        fill="oklch(0.7 0.16 55)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Menu breakdown table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Menu Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
            ) : menus.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No menus yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">#</th>
                      <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">Menu</th>
                      <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 text-right font-medium text-muted-foreground">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus.map((menu, i) => (
                      <tr key={menu.id} className="border-b border-border last:border-0">
                        <td className="py-3 pr-4">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-medium text-foreground">{menu.name}</td>
                        <td className="py-3 pr-4">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            menu.is_published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            {menu.is_published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="py-3 text-right font-medium text-foreground">{menu.views || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
