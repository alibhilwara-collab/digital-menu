import Link from "next/link"
import { QrCode, Smartphone, BarChart3, Zap, ArrowRight, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: QrCode,
    title: "QR Code Generation",
    description: "Generate unique QR codes for each menu. Customers simply scan to view your full menu.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Beautiful menus optimized for mobile. Your customers get a smooth browsing experience.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track menu views, popular items, and customer engagement with real-time analytics.",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Change prices, add items, or update availability. Changes reflect in real-time.",
  },
]

type PlanFeature = {
  label: string
  monthly: boolean | string
  yearly: boolean | string
}

const planFeatures: PlanFeature[] = [
  { label: "Restaurants", monthly: "3", yearly: "Unlimited" },
  { label: "Menu Categories", monthly: "Unlimited", yearly: "Unlimited" },
  { label: "Menu Items Per Category", monthly: "Unlimited", yearly: "Unlimited" },
  { label: "Scans Per Month", monthly: "Unlimited", yearly: "Unlimited" },
  { label: "Allow restaurants to accept orders", monthly: true, yearly: true },
  { label: "Allow restaurants to create table specific QR codes", monthly: true, yearly: true },
  { label: "Hide QuickQR Branding", monthly: true, yearly: true },
  { label: "No Advertisements", monthly: true, yearly: true },
  { label: "WhatsApp Ordering", monthly: true, yearly: true },
  { label: "Onboarding Assistance", monthly: true, yearly: true },
  { label: "Receive On Table Order", monthly: true, yearly: true },
  { label: "Receive Takeaway Order", monthly: true, yearly: true },
  { label: "Receive Online Order", monthly: true, yearly: true },
  { label: "Online Payments", monthly: true, yearly: true },
]

const plans = [
  {
    key: "monthly" as const,
    name: "Monthly Plan",
    tagline: "Everything you need",
    price: "250",
    period: "/ Month",
    highlighted: false,
    recommended: false,
  },
  {
    key: "yearly" as const,
    name: "Yearly Plan",
    tagline: "Best value - save more",
    price: "2,000",
    period: "/ Year",
    highlighted: true,
    recommended: true,
  },
]

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm font-semibold text-foreground">{value}</span>
  }
  return value ? (
    <Check className="h-4.5 w-4.5 text-primary" />
  ) : (
    <X className="h-4.5 w-4.5 text-muted-foreground/40" />
  )
}

function PricingSection() {
  return (
    <section className="py-20" id="pricing">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground">
            Membership Plans
          </h2>
          <p className="mt-3 text-muted-foreground">Simple pricing, no hidden charges</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-2xl border p-0 bg-card ${
                plan.highlighted
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                    Recommended
                  </span>
                </div>
              )}

              <div className={`rounded-t-2xl px-6 pt-8 pb-6 ${plan.highlighted ? "bg-primary/5" : ""}`}>
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                <div className="mt-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {"\u20B9"}{plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 px-6 pt-2 pb-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Features
                </p>
                <ul className="space-y-3">
                  {planFeatures.map((feature) => {
                    const val = feature[plan.key]
                    return (
                      <li key={feature.label} className="flex items-center gap-3">
                        <FeatureValue value={val} />
                        <span className={`text-sm ${val === false ? "text-muted-foreground/60" : "text-foreground"}`}>
                          {feature.label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="px-6 pb-8">
                <Link href="/signup">
                  <Button
                    className="w-full text-base"
                    size="lg"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <QrCode className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">MenuQR</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-3.5 w-3.5" />
            Trusted by 2,000+ restaurants
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Your restaurant menu,{" "}
            <span className="text-primary">now digital</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Create beautiful digital menus, generate QR codes, and let your
            customers browse your menu on their phones. Simple, fast, and free
            to start.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8 text-base">
                Create Your Menu
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/menu/menu-1">
              <Button variant="outline" size="lg" className="gap-2 px-8 text-base">
                View Demo Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground">
              Everything you need to go digital
            </h2>
            <p className="mt-3 text-muted-foreground">
              From menu creation to customer analytics, we have it covered.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <QrCode className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Digital Menu QR</span>
          </div>
          <p className="text-sm text-muted-foreground">
            2026 Digital Menu QR. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
