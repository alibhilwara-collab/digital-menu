"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { QRCodeSVG } from "qrcode.react"
import { Download, Copy, ExternalLink, QrCode, Smartphone } from "lucide-react"
import { toast } from "sonner"

type MenuRow = { id: string; name: string; description: string | null }

export default function QRPage() {
  const [menus, setMenus] = useState<MenuRow[]>([])
  const [selectedMenu, setSelectedMenu] = useState("")
  const [loading, setLoading] = useState(true)
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from("menus").select("id, name, description").order("created_at", { ascending: false })
      const menuList = data || []
      setMenus(menuList)
      if (menuList.length > 0) setSelectedMenu(menuList[0].id)
      setLoading(false)
    }
    load()
  }, [])

  const menu = menus.find((m) => m.id === selectedMenu) || menus[0]
  const menuUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/menu/${menu?.id || ""}`

  const handleDownload = useCallback(() => {
    if (!qrRef.current) return
    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const data = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      canvas.width = 512
      canvas.height = 512
      ctx?.drawImage(img, 0, 0, 512, 512)
      const link = document.createElement("a")
      link.download = `${(menu?.name || "menu").replace(/\s+/g, "-").toLowerCase()}-qr.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
      toast.success("QR code downloaded!")
    }

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)))
  }, [menu?.name])

  function copyLink() {
    navigator.clipboard.writeText(menuUrl)
    toast.success("Menu link copied to clipboard!")
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="QR Codes" />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">QR Code Generator</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate and download QR codes for your menus
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Controls */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base text-foreground">Select Menu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">Loading menus...</p>
                  ) : menus.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No menus yet. Create a menu first.</p>
                  ) : (
                    <>
                      <Select value={selectedMenu} onValueChange={setSelectedMenu}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Choose a menu" />
                        </SelectTrigger>
                        <SelectContent>
                          {menus.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {menu && (
                        <div className="rounded-lg border border-border bg-muted/50 p-3">
                          <p className="text-sm font-medium text-foreground">{menu.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{menu.description || "No description"}</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base text-foreground">Menu Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1 truncate rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
                      {menuUrl}
                    </div>
                    <Button variant="outline" size="icon" onClick={copyLink} aria-label="Copy link">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <a href={`/menu/${menu?.id || ""}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Menu Page
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base text-foreground">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <QrCode className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Print the QR code on table tents or menu cards
                    </li>
                    <li className="flex items-start gap-2">
                      <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Customers scan with any phone camera
                    </li>
                    <li className="flex items-start gap-2">
                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Share the link on social media too
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* QR Preview */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base text-foreground">QR Code Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div
                    ref={qrRef}
                    className="rounded-2xl border-2 border-border bg-card p-6 shadow-lg"
                  >
                    <QRCodeSVG
                      value={menuUrl}
                      size={220}
                      level="H"
                      includeMargin={false}
                      bgColor="transparent"
                      fgColor="currentColor"
                      className="text-foreground"
                    />
                  </div>
                  <p className="mt-4 text-center text-sm font-medium text-foreground">{menu?.name || "Menu"}</p>
                  <p className="text-xs text-muted-foreground">Scan to view menu</p>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleDownload} className="gap-1.5">
                      <Download className="h-4 w-4" />
                      Download PNG
                    </Button>
                    <Button variant="outline" onClick={copyLink} className="gap-1.5">
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* All QR thumbnails */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base text-foreground">All Menus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {menus.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMenu(m.id)}
                        className={`flex flex-col items-center rounded-lg border p-3 transition-all ${
                          selectedMenu === m.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <QRCodeSVG
                          value={`${typeof window !== "undefined" ? window.location.origin : ""}/menu/${m.id}`}
                          size={64}
                          level="L"
                          bgColor="transparent"
                          fgColor="currentColor"
                          className="text-foreground"
                        />
                        <p className="mt-2 truncate text-xs font-medium text-foreground max-w-full">{m.name}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
