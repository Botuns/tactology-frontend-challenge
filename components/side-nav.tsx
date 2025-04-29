"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, LayoutDashboard, Network, Settings, Users } from "lucide-react"

const items = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Departments",
    href: "/dashboard",
    icon: Building2,
    exact: true,
  },
  {
    name: "Hierarchy",
    href: "/dashboard/hierarchy",
    icon: Network,
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r border-gray-100 bg-white lg:block lg:w-56">
      <div className="flex h-full flex-col gap-1 p-3">
        <div className="flex h-12 items-center px-3 py-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="font-medium text-sm">Tactology</span>
          </Link>
        </div>
        <nav className="grid gap-0.5 px-1 pt-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium hover:bg-secondary", {
                "bg-secondary text-primary": item.exact ? pathname === item.href : pathname.startsWith(item.href),
                "text-muted-foreground": !(item.exact ? pathname === item.href : pathname.startsWith(item.href)),
              })}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
