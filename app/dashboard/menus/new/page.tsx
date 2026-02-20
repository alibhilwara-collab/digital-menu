"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Plus,
  Trash2,
  ImageIcon,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Save,
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { ImageUpload } from "@/components/image-upload"

interface NewItem {
  id: string
  name: string
  price: string
  description: string
  image: string
  available: boolean
}

interface NewCategory {
  id: string
  name: string
  items: NewItem[]
  expanded: boolean
}

export default function NewMenuPage() {
  const router = useRouter()
  const [menuName, setMenuName] = useState("")
  const [menuDescription, setMenuDescription] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [categories, setCategories] = useState<NewCategory[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [saving, setSaving] = useState(false)
  const [addItemCatId, setAddItemCatId] = useState<string | null>(null)
  const [itemForm, setItemForm] = useState<NewItem>({
    id: "",
    name: "",
    price: "",
    description: "",
    image: "",
    available: true,
  })

  function addCategory() {
    if (!newCategoryName.trim()) return
    setCategories([
      ...categories,
      {
        id: `cat-${Date.now()}`,
        name: newCategoryName.trim(),
        items: [],
        expanded: true,
      },
    ])
    setNewCategoryName("")
  }

  function deleteCategory(catId: string) {
    setCategories(categories.filter((c) => c.id !== catId))
  }

  function toggleCategory(catId: string) {
    setCategories(
      categories.map((c) =>
        c.id === catId ? { ...c, expanded: !c.expanded } : c
      )
    )
  }

  function openAddItem(catId: string) {
    setAddItemCatId(catId)
    setItemForm({
      id: `item-${Date.now()}`,
      name: "",
      price: "",
      description: "",
      image: "",
      available: true,
    })
  }

  function saveItem() {
    if (!itemForm.name.trim() || !itemForm.price.trim()) {
      toast.error("Please fill in item name and price")
      return
    }
    setCategories(
      categories.map((c) =>
        c.id === addItemCatId
          ? { ...c, items: [...c.items, { ...itemForm }] }
          : c
      )
    )
    setAddItemCatId(null)
    toast.success("Item added")
  }

  function deleteItem(catId: string, itemId: string) {
    setCategories(
      categories.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
          : c
      )
    )
  }

  function toggleItemAvailability(catId: string, itemId: string) {
    setCategories(
      categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, available: !i.available } : i
              ),
            }
          : c
      )
    )
  }

  async function handleSave() {
    if (!menuName.trim()) {
      toast.error("Please enter a menu name")
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not logged in")

      // Create menu
      const { data: menu, error: menuErr } = await supabase
        .from("menus")
        .insert({ user_id: user.id, name: menuName.trim(), description: menuDescription.trim() || null, cover_image: coverImage || null, whatsapp_number: whatsappNumber.trim() || null })
        .select()
        .single()
      if (menuErr) throw menuErr

      // Create categories and items
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i]
        const { data: catData, error: catErr } = await supabase
          .from("categories")
          .insert({ menu_id: menu.id, name: cat.name, sort_order: i })
          .select()
          .single()
        if (catErr) throw catErr

        if (cat.items.length > 0) {
          const itemRows = cat.items.map((item, j) => ({
            category_id: catData.id,
            name: item.name,
            price: parseFloat(item.price),
            description: item.description || null,
            image: item.image || null,
            available: item.available,
            sort_order: j,
          }))
          const { error: itemErr } = await supabase.from("items").insert(itemRows)
          if (itemErr) throw itemErr
        }
      }

      toast.success("Menu created successfully!")
      router.push("/dashboard/menus")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save menu"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Create Menu" />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard/menus">
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Go back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              New Menu
            </h2>
            <p className="text-sm text-muted-foreground">Fill in the details and add your items</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          {/* Basic info */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Menu Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Menu Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. The Spice Kitchen"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  placeholder="A brief description of your restaurant or menu"
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <ImageUpload
                  value={coverImage}
                  onChange={setCoverImage}
                  folder="covers"
                  aspectRatio="video"
              />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number (for orders)</Label>
                <Input
                  id="whatsapp"
                  placeholder="e.g. 919876543210 (with country code)"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Customers will send orders to this WhatsApp number. Include country code without + sign.
                </p>
              </div>
              </CardContent>
          </Card>

          {/* Categories */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base text-foreground">Categories & Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add category */}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Starters, Main Course, Drinks"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCategory()}
                  className="h-10"
                />
                <Button onClick={addCategory} size="sm" className="h-10 gap-1.5 px-4">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {categories.length === 0 && (
                <div className="rounded-lg border border-dashed border-border py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    No categories yet. Add a category to get started.
                  </p>
                </div>
              )}

              {/* Category list */}
              {categories.map((cat) => (
                <div key={cat.id} className="rounded-lg border border-border">
                  <div
                    className="flex cursor-pointer items-center gap-2 p-3 transition-colors hover:bg-muted/50"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    {cat.expanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="flex-1 font-medium text-foreground">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {cat.items.length} item{cat.items.length !== 1 ? "s" : ""}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteCategory(cat.id)
                      }}
                      aria-label={`Delete category ${cat.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>

                  {cat.expanded && (
                    <div className="border-t border-border p-3">
                      {cat.items.length === 0 && (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          No items in this category
                        </p>
                      )}
                      {cat.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Rs.{item.price}</p>
                          </div>
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => toggleItemAvailability(cat.id, item.id)}
                            aria-label="Toggle item availability"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => deleteItem(cat.id, item.id)}
                            aria-label={`Delete item ${item.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                      <Dialog open={addItemCatId === cat.id} onOpenChange={(open) => !open && setAddItemCatId(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full gap-1.5 border-dashed"
                            onClick={() => openAddItem(cat.id)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Item
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Add Item to {cat.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <Label>Item Name</Label>
                              <Input
                                placeholder="e.g. Butter Chicken"
                                value={itemForm.name}
                                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                className="h-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Price (Rs.)</Label>
                              <Input
                                type="number"
                                placeholder="e.g. 350"
                                value={itemForm.price}
                                onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                                className="h-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                placeholder="Brief description of the item"
                                value={itemForm.description}
                                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Item Image (optional)</Label>
                              <ImageUpload
                                value={itemForm.image}
                                onChange={(url) => setItemForm({ ...itemForm, image: url })}
                                folder="items"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Available</Label>
                              <Switch
                                checked={itemForm.available}
                                onCheckedChange={(checked) => setItemForm({ ...itemForm, available: checked })}
                              />
                            </div>
                            <Button onClick={saveItem} className="w-full">
                              Add Item
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex justify-end gap-3 pb-8">
            <Link href="/dashboard/menus">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSave} className="gap-2" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Menu"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
