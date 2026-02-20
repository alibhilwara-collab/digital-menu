"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Monthly Plan",
    price: "250",
    period: "/ Month",
    features: [
      "3 Restaurants",
      "Unlimited Menu Categories",
      "Unlimited Menu Items",
      "Unlimited Scans",
      "Accept Orders",
      "Table Specific QR Codes",
      "Hide QuickQR Branding",
      "No Advertisements",
      "WhatsApp Ordering",
    ],
  },
  {
    name: "Yearly Plan",
    price: "2,000",
    period: "/ Year",
    recommended: true,
    features: [
      "Unlimited Restaurants",
      "Unlimited Menu Categories",
      "Unlimited Menu Items",
      "Unlimited Scans",
      "Accept Orders",
      "Table Specific QR Codes",
      "Hide QuickQR Branding",
      "No Advertisements",
      "WhatsApp Ordering",
      "Onboarding Assistance",
      "Priority Support",
    ],
  },
]

export default function MembershipPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Membership" />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Membership</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your subscription plan
          </p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-foreground">
              <Crown className="h-5 w-5 text-primary" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted-foreground text-card">
                    <th className="rounded-tl-lg px-6 py-3 text-left text-sm font-semibold">Membership</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Start Date</th>
                    <th className="rounded-tr-lg px-6 py-3 text-left text-sm font-semibold">Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">Free Trial</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">-</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <h3 className="mb-4 text-lg font-semibold text-foreground">Change Plan</h3>
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border ${plan.recommended ? "border-primary shadow-lg shadow-primary/10" : "border-border"}`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                </div>
              )}
              <CardHeader className={plan.recommended ? "bg-primary/5 rounded-t-xl" : ""}>
                <CardTitle className="text-lg text-foreground">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-foreground">{"\u20B9"}{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.recommended ? "default" : "outline"}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
