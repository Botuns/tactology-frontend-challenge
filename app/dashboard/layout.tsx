import type React from "react"
import { SideNav } from "@/components/side-nav"
import { TopNav } from "@/components/top-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TopNav />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
