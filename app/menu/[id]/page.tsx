"use client"

import { useState, useEffect, useRef, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Minus, ShoppingCart, X, Send, Phone, MapPin, Clock, Menu as MenuIcon } from "lucide-react"
import Link from "next/link"

type MenuItem = {
  id: string
  name: string
  price: number
  description: string | null
  image: string | null
  available: boolean
}

type Category = {
  id: string
  name: string
  items: MenuItem[]
}

type MenuData = {
  id: string
  name: string
  description: string | null
  cover_image: string | null
  whatsapp_number: string | null
}

type CartItem = {
  id: string
  name: string
  price: number
  qty: number
}

export default function PublicMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [menu, setMenu] = useState<MenuData | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | "delivery">("dine-in")
  const [customerName, setCustomerName] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [orderSent, setOrderSent] = useState(false)
  const [lastOrderTotal, setLastOrderTotal] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: menuData } = await supabase
        .from("menus")
        .select("*")
        .eq("id", id)
        .single()

      if (menuData) {
        setMenu(menuData)
        const { data: cats } = await supabase
          .from("categories")
          .select("*, items(*)")
          .eq("menu_id", id)
          .order("sort_order")
        const catList = cats || []
        setCategories(catList)
        if (catList.length > 0) setActiveCategory(catList[0].id)
      }
      setLoading(false)
    }
    load()
  }, [id])

  function scrollToCategory(catId: string) {
    setActiveCategory(catId)
    setSidebarOpen(false)
    const el = document.getElementById(`cat-${catId}`)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function addToCart(item: { id: string; name: string; price: number }) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }]
    })
  }

  function removeFromCart(itemId: string) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === itemId)
      if (existing && existing.qty > 1) return prev.map((c) => (c.id === itemId ? { ...c, qty: c.qty - 1 } : c))
      return prev.filter((c) => c.id !== itemId)
    })
  }

  function getItemQty(itemId: string) {
    return cart.find((c) => c.id === itemId)?.qty || 0
  }

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0)
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.qty, 0)

  async function sendToWhatsApp() {
    if (!menu?.whatsapp_number || cart.length === 0) return
    const orderTypeLabel = orderType === "dine-in" ? "Dine-In" : orderType === "takeaway" ? "Takeaway" : "Delivery"
    let message = `*New Order - ${menu.name}*\n`
    message += `Order Type: *${orderTypeLabel}*\n`
    if (customerName.trim()) message += `Name: *${customerName.trim()}*\n`
    if (orderType === "dine-in" && tableNumber.trim()) message += `Table: *${tableNumber.trim()}*\n`
    message += `\n---\n`
    cart.forEach((item) => {
      message += `${item.qty}x ${item.name} - Rs.${(item.price * item.qty).toFixed(0)}\n`
    })
    message += `---\n`
    message += `*Total: Rs.${totalPrice.toFixed(0)}*\n`
    message += `\nSent via Digital Menu QR`
    // Save order to database
    const supabase = createClient()
    await supabase.from("orders").insert({
      menu_id: menu.id,
      order_type: orderTypeLabel,
      table_number: orderType === "dine-in" ? tableNumber.trim() || null : null,
      customer_name: customerName.trim() || null,
      customer_phone: null,
      items: cart.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
      total: totalPrice,
      status: "pending",
    })

    const url = `https://wa.me/${menu.whatsapp_number}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
    setLastOrderTotal(totalPrice)
    setOrderSent(true)
    setCart([])
    setShowCart(false)
    setCustomerName("")
    setTableNumber("")
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background gap-3">
        <p className="text-lg font-semibold text-foreground">Menu not found</p>
        <p className="text-sm text-muted-foreground">This menu may have been removed.</p>
        <Link href="/" className="text-sm text-primary underline">Go Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#f5f5f5]">
      {/* Red Top Bar + Hamburger (mobile) */}
      <div className="sticky top-0 z-30 flex h-10 items-center bg-[#c0392b] px-3 lg:hidden">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white" aria-label="Toggle categories">
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Hero - Cover Image Background */}
      <div className="relative">
        {menu.cover_image ? (
          <div className="relative h-44 sm:h-56 overflow-hidden">
            <img src={menu.cover_image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-r from-[#c0392b] to-[#e74c3c]" />
        )}

        {/* Restaurant Info Card */}
        <div className="relative mx-auto max-w-5xl px-4">
          <div className="relative -mt-10 flex flex-col items-center gap-4 rounded-xl bg-white p-5 shadow-md sm:flex-row sm:items-start">
            {/* Logo */}
            {menu.cover_image && (
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-white shadow-sm">
                <img src={menu.cover_image} alt={menu.name} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold text-[#222] sm:text-2xl">{menu.name}</h1>
              {menu.description && (
                <p className="mt-1 text-sm text-[#666]">{menu.description}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-[#888] sm:justify-start">
                {menu.whatsapp_number && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {menu.whatsapp_number}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Items */}
      <div className="mx-auto max-w-5xl px-4 pt-6 pb-8 lg:flex lg:gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-56 shrink-0">
          <div className="sticky top-4 rounded-xl bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#999]">All Categories</p>
            <nav className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-[#c0392b]/10 text-[#c0392b]"
                      : "text-[#555] hover:bg-[#f5f5f5]"
                  }`}
                >
                  <span className="text-xs">&#127860;</span>
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-black/40" />
            <aside
              className="absolute left-0 top-0 h-full w-60 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cover in sidebar */}
              {menu.cover_image && (
                <div className="h-32 overflow-hidden">
                  <img src={menu.cover_image} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#999]">All Categories</p>
                <nav className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => scrollToCategory(cat.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        activeCategory === cat.id
                          ? "bg-[#c0392b]/10 text-[#c0392b]"
                          : "text-[#555] hover:bg-[#f5f5f5]"
                      }`}
                    >
                      <span className="text-xs">&#127860;</span>
                      {cat.name}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        )}

        {/* Items Section */}
        <div className={`flex-1 ${totalItems > 0 ? "pb-20" : ""}`}>
          {categories.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <p className="text-[#999]">This menu has no items yet.</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} id={`cat-${cat.id}`} className="mb-6">
                <h2 className="mb-3 text-base font-bold text-[#333]">{cat.name}</h2>
                <div className="space-y-2">
                  {cat.items.map((item) => {
                    const qty = getItemQty(item.id)
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
                          !item.available ? "opacity-50" : ""
                        }`}
                      >
                        {/* Thumbnail */}
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#f0f0f0]">
                            <span className="text-lg font-bold text-[#ccc]">{item.name.charAt(0)}</span>
                          </div>
                        )}

                        {/* Name & Price */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-[#222]">
                            {item.name}
                            {item.price > 0 && (
                              <span className="text-[#555]"> &ndash; {"\u20B9"}{item.price}</span>
                            )}
                          </h3>
                          {item.price > 0 && (
                            <p className="text-xs text-[#888]">{"\u20B9"}{item.price.toFixed(2)}</p>
                          )}
                          {item.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-[#aaa]">{item.description}</p>
                          )}
                          {!item.available && (
                            <p className="mt-0.5 text-xs font-medium text-[#c0392b]">Unavailable</p>
                          )}
                        </div>

                        {/* ADD Button */}
                        {item.available && menu.whatsapp_number && (
                          <div className="shrink-0">
                            {qty === 0 ? (
                              <button
                                onClick={() => addToCart(item)}
                                className="rounded border border-[#ccc] bg-white px-3 py-1.5 text-xs font-semibold text-[#333] transition-colors hover:border-[#c0392b] hover:text-[#c0392b]"
                              >
                                ADD +
                              </button>
                            ) : (
                              <div className="flex items-center gap-1 rounded border border-[#c0392b] bg-[#c0392b]/5">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="flex h-7 w-7 items-center justify-center text-[#c0392b]"
                                  aria-label="Remove one"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="min-w-[1.25rem] text-center text-xs font-bold text-[#c0392b]">{qty}</span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="flex h-7 w-7 items-center justify-center text-[#c0392b]"
                                  aria-label="Add one"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Cart Bar */}
      {totalItems > 0 && menu.whatsapp_number && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
          <button
            onClick={() => setShowCart(true)}
            className="flex w-full items-center justify-between rounded-xl bg-[#25D366] px-4 py-3 text-white transition-colors hover:bg-[#1fb855]"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm font-semibold">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </span>
            </div>
            <span className="text-sm font-bold">{"\u20B9"}{totalPrice.toFixed(0)} &middot; View Order</span>
          </button>
        </div>
      )}

      {/* Cart / Order Sheet */}
      {showCart && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/50" onClick={() => setShowCart(false)}>
          <div className="w-full max-w-lg rounded-t-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-lg font-bold text-[#222]">Your Order</h3>
              <button onClick={() => setShowCart(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5f5f5]" aria-label="Close">
                <X className="h-5 w-5 text-[#888]" />
              </button>
            </div>
            <div className="max-h-[40vh] overflow-y-auto px-4 py-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-[#f0f0f0] py-2.5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#222]">{item.name}</p>
                    <p className="text-xs text-[#888]">{"\u20B9"}{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded border border-[#ddd]">
                      <button onClick={() => removeFromCart(item.id)} className="flex h-7 w-7 items-center justify-center text-[#555]" aria-label="Remove">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[1.25rem] text-center text-sm font-semibold text-[#222]">{item.qty}</span>
                      <button onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })} className="flex h-7 w-7 items-center justify-center text-[#555]" aria-label="Add">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="w-16 text-right text-sm font-semibold text-[#222]">{"\u20B9"}{(item.price * item.qty).toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t px-4 py-3 space-y-3">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#999]">Order Type</p>
                <div className="flex gap-2">
                  {(["dine-in", "takeaway", "delivery"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        orderType === type
                          ? "border-[#c0392b] bg-[#c0392b]/10 text-[#c0392b]"
                          : "border-[#ddd] text-[#888] hover:bg-[#f5f5f5]"
                      }`}
                    >
                      {type === "dine-in" ? "Dine-In" : type === "takeaway" ? "Takeaway" : "Delivery"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="flex-1 rounded-lg border border-[#ddd] bg-white px-3 py-2 text-sm text-[#222] placeholder:text-[#bbb] focus:outline-none focus:ring-1 focus:ring-[#c0392b]"
                />
                {orderType === "dine-in" && (
                  <input
                    type="text"
                    placeholder="Table No."
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-24 rounded-lg border border-[#ddd] bg-white px-3 py-2 text-sm text-[#222] placeholder:text-[#bbb] focus:outline-none focus:ring-1 focus:ring-[#c0392b]"
                  />
                )}
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs text-[#999]">Total</p>
                  <p className="text-xl font-bold text-[#222]">{"\u20B9"}{totalPrice.toFixed(0)}</p>
                </div>
                <button
                  onClick={sendToWhatsApp}
                  className="flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1fb855]"
                >
                  <Send className="h-4 w-4" />
                  Send on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Sent Confirmation */}
      {orderSent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50" onClick={() => setOrderSent(false)}>
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10">
              <Send className="h-7 w-7 text-[#25D366]" />
            </div>
            <h3 className="text-xl font-bold text-[#222]">Order Sent!</h3>
            <p className="mt-2 text-sm text-[#888]">Your order has been sent via WhatsApp.</p>
            <div className="mt-4 rounded-xl bg-[#f5f5f5] p-4">
              <p className="text-xs text-[#999]">Total Amount</p>
              <p className="text-2xl font-bold text-[#222]">{"\u20B9"}{lastOrderTotal.toFixed(0)}</p>
            </div>
            <button
              onClick={() => setOrderSent(false)}
              className="mt-4 w-full rounded-xl bg-[#c0392b] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a93226]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`bg-white py-4 text-center ${totalItems > 0 ? "mb-16" : ""}`}>
        <Link href="/" className="text-xs text-[#bbb]">
          Powered by <span className="font-semibold text-[#c0392b]">Digital Menu QR</span>
        </Link>
      </div>
    </div>
  )
}
