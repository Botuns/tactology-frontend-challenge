import { DepartmentForm } from "@/components/department-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditDepartmentPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/departments/${params.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-medium tracking-tight">Edit Department</h1>
      </div>
      <DepartmentForm departmentId={params.id} />
    </div>
  )
}
