import { createClient } from "@/lib/supabase/server"

export type MenuWithDetails = {
  id: string
  name: string
  description: string | null
  cover_image: string | null
  is_published: boolean
  views: number
  created_at: string
  categories: CategoryWithItems[]
}

export type CategoryWithItems = {
  id: string
  name: string
  sort_order: number
  items: MenuItem[]
}

export type MenuItem = {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  available: boolean
  sort_order: number
}

export type Profile = {
  id: string
  full_name: string | null
  restaurant_name: string | null
  email: string | null
  phone: string | null
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data as Profile | null
}

export async function getMenus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: menus } = await supabase
    .from("menus")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (!menus || menus.length === 0) return []

  const menusWithDetails: MenuWithDetails[] = []

  for (const menu of menus) {
    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .eq("menu_id", menu.id)
      .order("sort_order", { ascending: true })

    const catsWithItems: CategoryWithItems[] = []

    for (const cat of categories || []) {
      const { data: items } = await supabase
        .from("items")
        .select("*")
        .eq("category_id", cat.id)
        .order("sort_order", { ascending: true })

      catsWithItems.push({
        id: cat.id,
        name: cat.name,
        sort_order: cat.sort_order,
        items: (items || []).map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          description: i.description,
          image_url: i.image_url,
          available: i.available,
          sort_order: i.sort_order,
        })),
      })
    }

    menusWithDetails.push({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      cover_image: menu.cover_image,
      is_published: menu.is_published,
      views: menu.views,
      created_at: menu.created_at,
      categories: catsWithItems,
    })
  }

  return menusWithDetails
}

export async function getMenuById(menuId: string) {
  const supabase = await createClient()

  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("id", menuId)
    .single()

  if (!menu) return null

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("menu_id", menu.id)
    .order("sort_order", { ascending: true })

  const catsWithItems: CategoryWithItems[] = []

  for (const cat of categories || []) {
    const { data: items } = await supabase
      .from("items")
      .select("*")
      .eq("category_id", cat.id)
      .order("sort_order", { ascending: true })

    catsWithItems.push({
      id: cat.id,
      name: cat.name,
      sort_order: cat.sort_order,
      items: (items || []).map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        description: i.description,
        image_url: i.image_url,
        available: i.available,
        sort_order: i.sort_order,
      })),
    })
  }

  return {
    id: menu.id,
    name: menu.name,
    description: menu.description,
    cover_image: menu.cover_image,
    is_published: menu.is_published,
    views: menu.views,
    user_id: menu.user_id,
    created_at: menu.created_at,
    categories: catsWithItems,
  } as MenuWithDetails & { user_id: string }
}

// Public: increment views + fetch menu (no auth needed)
export async function getPublicMenu(menuId: string) {
  const supabase = await createClient()

  // Increment views
  await supabase.rpc("increment_menu_views", { menu_id_input: menuId }).catch(() => {})

  return getMenuById(menuId)
}
