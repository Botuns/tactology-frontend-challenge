"use client"

import { useQuery, gql } from "@apollo/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Layers, Loader2, Users } from "lucide-react"

const GET_DEPARTMENTS = gql`
  query GetAllDepartments {
    departments {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`

export function DepartmentStats() {
  const { data, loading, error } = useQuery(GET_DEPARTMENTS)

  if (loading)
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )

  if (error) return null

  const departments = data?.departments || []
  const totalDepartments = departments.length
  const totalSubDepartments = departments.reduce((acc, dept) => acc + dept.subDepartments.length, 0)
  const avgSubDepartments = totalDepartments > 0 ? (totalSubDepartments / totalDepartments).toFixed(1) : "0"

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4">
          <CardTitle className="text-xs font-medium">Total Departments</CardTitle>
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-medium">{totalDepartments}</div>
          <p className="text-xs text-muted-foreground mt-0.5">Main organizational units</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4">
          <CardTitle className="text-xs font-medium">Total Sub-Departments</CardTitle>
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-medium">{totalSubDepartments}</div>
          <p className="text-xs text-muted-foreground mt-0.5">Specialized functional units</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4">
          <CardTitle className="text-xs font-medium">Avg. Sub-Departments</CardTitle>
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-medium">{avgSubDepartments}</div>
          <p className="text-xs text-muted-foreground mt-0.5">Per department average</p>
        </CardContent>
      </Card>
    </div>
  )
}
