import { DepartmentList } from "@/components/department-list"
import { DepartmentStats } from "@/components/department-stats"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium tracking-tight">Departments</h1>
        <Link href="/dashboard/departments/new">
          <Button className="h-8 text-xs gap-1.5">
            <PlusCircle className="h-3.5 w-3.5" />
            New Department
          </Button>
        </Link>
      </div>
      <DepartmentStats />
      <DepartmentList />
    </div>
  )
}
