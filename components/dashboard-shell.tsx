"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"

export type DashboardUser = {
  id: string
  email: string
  fullName: string
  restaurantName: string
}

export function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh bg-background">
      <DashboardSidebar user={user} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
