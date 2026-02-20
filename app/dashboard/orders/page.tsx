"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  ClipboardList,
  Check,
  Trash2,
  Eye,
  Volume2,
} from "lucide-react"

type OrderItem = {
  name: string
  qty: number
  price: number
}

type Order = {
  id: string
  menu_id: string
  order_type: string
  table_number: string | null
  customer_name: string | null
  customer_phone: string | null
  items: OrderItem[]
  total: number
  status: string
  created_at: string
  menu_name?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get user's menus first
    const { data: menus } = await supabase
      .from("menus")
      .select("id, name")
      .eq("user_id", user.id)

    if (!menus || menus.length === 0) {
      setLoading(false)
      return
    }

    const menuIds = menus.map((m) => m.id)
    const menuMap = Object.fromEntries(menus.map((m) => [m.id, m.name]))

    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .in("menu_id", menuIds)
      .order("created_at", { ascending: false })

    const ordersWithMenu = (ordersData || []).map((o: Order) => ({
      ...o,
      items: typeof o.items === "string" ? JSON.parse(o.items) : o.items || [],
      menu_name: menuMap[o.menu_id] || "Unknown",
    }))

    setOrders(ordersWithMenu)
    setLoading(false)
  }

  async function updateStatus(orderId: string, status: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
    if (error) {
      toast.error("Failed to update order")
      return
    }
    toast.success(`Order ${status}`)
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }

  async function deleteOrder(orderId: string) {
    const supabase = createClient()
    const { error } = await supabase.from("orders").delete().eq("id", orderId)
    if (error) {
      toast.error("Failed to delete order")
      return
    }
    toast.success("Order deleted")
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + " " + d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Orders" />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Orders</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage customer orders from your restaurants
            </p>
          </div>
          <Button variant="outline" size="icon" aria-label="Order notification sound">
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-foreground">
              <ClipboardList className="h-5 w-5 text-primary" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No orders found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted-foreground text-card">
                      <th className="rounded-tl-lg px-4 py-3 text-left text-sm font-semibold">Table / Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Menu</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
                      <th className="rounded-tr-lg px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-3">
                          {order.table_number ? (
                            <span className="text-sm font-medium text-foreground">{order.table_number}</span>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                              {order.order_type}
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-foreground">
                            {order.items.map((item, i) => (
                              <div key={i}>
                                {"🍽 "}{item.name} {" - \u20B9"}{item.price}
                                {item.qty > 1 && ` x ${item.qty}`}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            {order.customer_name && (
                              <div className="text-foreground font-medium">{order.customer_name}</div>
                            )}
                            {order.customer_phone && (
                              <div className="text-muted-foreground">{order.customer_phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-primary">
                            {"\u20B9"}{order.total?.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              order.status === "completed"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-800 border-red-300"
                                : "bg-yellow-100 text-yellow-800 border-yellow-300"
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {order.status === "pending" && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700"
                                onClick={() => updateStatus(order.id, "completed")}
                                aria-label="Complete order"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => deleteOrder(order.id)}
                              aria-label="Delete order"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700"
                              onClick={() => {
                                const msg = `Order from ${order.customer_name || "Customer"}:\n${order.items.map((i) => `${i.qty}x ${i.name} - Rs.${i.price * i.qty}`).join("\n")}\nTotal: Rs.${order.total}`
                                window.open(`https://wa.me/${order.customer_phone || ""}?text=${encodeURIComponent(msg)}`, "_blank")
                              }}
                              aria-label="WhatsApp customer"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
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
