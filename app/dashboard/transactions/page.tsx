"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt } from "lucide-react"

export default function TransactionsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Transactions" />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Transactions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View your payment history and invoices
          </p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-foreground">
              <Receipt className="h-5 w-5 text-primary" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted-foreground text-card">
                    <th className="rounded-tl-lg px-6 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Payment Method</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="rounded-tr-lg px-6 py-3 text-left text-sm font-semibold">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No Data Found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
