import { DepartmentForm } from "@/components/department-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewDepartmentPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-medium tracking-tight">New Department</h1>
      </div>
      <DepartmentForm />
    </div>
  )
}
