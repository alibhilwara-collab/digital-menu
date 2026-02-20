export interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  image: string
  available: boolean
}

export interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

export interface Menu {
  id: string
  name: string
  description: string
  coverImage: string
  categories: MenuCategory[]
  createdAt: string
  views: number
  isPublished: boolean
}

export const mockMenus: Menu[] = [
  {
    id: "menu-1",
    name: "The Spice Kitchen",
    description: "Authentic Indian street food and modern fusion dishes",
    coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    createdAt: "2026-01-15",
    views: 1243,
    isPublished: true,
    categories: [
      {
        id: "cat-1",
        name: "Starters",
        items: [
          { id: "item-1", name: "Paneer Tikka", price: 220, description: "Marinated cottage cheese grilled to perfection", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80", available: true },
          { id: "item-2", name: "Chicken 65", price: 280, description: "Spicy deep-fried chicken bites with curry leaves", image: "https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&q=80", available: true },
          { id: "item-3", name: "Veg Spring Rolls", price: 180, description: "Crispy rolls stuffed with mixed vegetables", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", available: true },
          { id: "item-4", name: "Masala Papad", price: 80, description: "Crispy papad topped with onion and tomato masala", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80", available: false },
        ],
      },
      {
        id: "cat-2",
        name: "Main Course",
        items: [
          { id: "item-5", name: "Butter Chicken", price: 350, description: "Tender chicken in rich tomato-butter gravy", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80", available: true },
          { id: "item-6", name: "Dal Makhani", price: 250, description: "Slow-cooked black lentils in creamy sauce", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80", available: true },
          { id: "item-7", name: "Biryani Special", price: 320, description: "Aromatic basmati rice with spices and herbs", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80", available: true },
          { id: "item-8", name: "Palak Paneer", price: 270, description: "Cottage cheese cubes in creamy spinach gravy", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80", available: true },
        ],
      },
      {
        id: "cat-3",
        name: "Breads",
        items: [
          { id: "item-9", name: "Butter Naan", price: 60, description: "Soft tandoori bread with butter", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80", available: true },
          { id: "item-10", name: "Garlic Naan", price: 80, description: "Naan topped with garlic and coriander", image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&q=80", available: true },
          { id: "item-11", name: "Tandoori Roti", price: 40, description: "Whole wheat bread from the tandoor", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80", available: true },
        ],
      },
      {
        id: "cat-4",
        name: "Drinks",
        items: [
          { id: "item-12", name: "Mango Lassi", price: 120, description: "Chilled yogurt drink with mango pulp", image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80", available: true },
          { id: "item-13", name: "Masala Chai", price: 50, description: "Traditional Indian spiced tea", image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", available: true },
          { id: "item-14", name: "Fresh Lime Soda", price: 80, description: "Refreshing lime with soda water", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=400&q=80", available: true },
        ],
      },
      {
        id: "cat-5",
        name: "Desserts",
        items: [
          { id: "item-15", name: "Gulab Jamun", price: 100, description: "Deep-fried milk dumplings in sugar syrup", image: "https://images.unsplash.com/photo-1666190540743-03a90bbd700f?w=400&q=80", available: true },
          { id: "item-16", name: "Kulfi", price: 90, description: "Traditional Indian ice cream with pistachios", image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80", available: true },
        ],
      },
    ],
  },
  {
    id: "menu-2",
    name: "Cafe Sunrise",
    description: "Fresh brews, pastries, and light bites",
    coverImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    createdAt: "2026-02-01",
    views: 856,
    isPublished: true,
    categories: [
      {
        id: "cat-6",
        name: "Coffee",
        items: [
          { id: "item-17", name: "Espresso", price: 150, description: "Strong single shot of espresso", image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80", available: true },
          { id: "item-18", name: "Cappuccino", price: 200, description: "Espresso with steamed milk foam", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80", available: true },
          { id: "item-19", name: "Cold Brew", price: 220, description: "Slow-steeped cold coffee concentrate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80", available: true },
        ],
      },
      {
        id: "cat-7",
        name: "Snacks",
        items: [
          { id: "item-20", name: "Croissant", price: 120, description: "Freshly baked butter croissant", image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&q=80", available: true },
          { id: "item-21", name: "Club Sandwich", price: 280, description: "Triple-decker with chicken and veggies", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80", available: true },
          { id: "item-22", name: "Chocolate Muffin", price: 130, description: "Rich chocolate chip muffin", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80", available: false },
        ],
      },
    ],
  },
  {
    id: "menu-3",
    name: "Egg Point",
    description: "All things egg - omelettes, bhurji, and more",
    coverImage: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80",
    createdAt: "2026-02-10",
    views: 432,
    isPublished: false,
    categories: [
      {
        id: "cat-8",
        name: "Egg Specials",
        items: [
          { id: "item-23", name: "Egg Bhurji", price: 80, description: "Scrambled eggs with onions and spices", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80", available: true },
          { id: "item-24", name: "Omelette", price: 70, description: "Classic fluffy omelette with herbs", image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&q=80", available: true },
          { id: "item-25", name: "Egg Fried Rice", price: 120, description: "Wok-tossed rice with scrambled eggs", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80", available: true },
        ],
      },
    ],
  },
]

export const analyticsData = {
  totalViews: 2531,
  totalMenus: 3,
  totalItems: 25,
  viewsThisMonth: 847,
  dailyViews: [
    { date: "Feb 1", views: 42 },
    { date: "Feb 2", views: 38 },
    { date: "Feb 3", views: 55 },
    { date: "Feb 4", views: 67 },
    { date: "Feb 5", views: 48 },
    { date: "Feb 6", views: 72 },
    { date: "Feb 7", views: 85 },
    { date: "Feb 8", views: 63 },
    { date: "Feb 9", views: 91 },
    { date: "Feb 10", views: 78 },
    { date: "Feb 11", views: 56 },
    { date: "Feb 12", views: 69 },
    { date: "Feb 13", views: 83 },
    { date: "Feb 14", views: 100 },
  ],
  popularItems: [
    { name: "Butter Chicken", views: 342, menu: "The Spice Kitchen" },
    { name: "Biryani Special", views: 289, menu: "The Spice Kitchen" },
    { name: "Cappuccino", views: 234, menu: "Cafe Sunrise" },
    { name: "Paneer Tikka", views: 198, menu: "The Spice Kitchen" },
    { name: "Cold Brew", views: 167, menu: "Cafe Sunrise" },
    { name: "Egg Bhurji", views: 143, menu: "Egg Point" },
    { name: "Mango Lassi", views: 131, menu: "The Spice Kitchen" },
    { name: "Club Sandwich", views: 118, menu: "Cafe Sunrise" },
  ],
}

export const userProfile = {
  name: "Rahul Sharma",
  email: "rahul@spicekitchen.com",
  restaurant: "The Spice Kitchen",
  phone: "+91 98765 43210",
  plan: "Pro",
}
