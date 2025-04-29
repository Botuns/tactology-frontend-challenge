"use client"

import { useState } from "react"
import { useQuery, gql } from "@apollo/client"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Edit, Eye, Loader2, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useDepartmentDelete } from "@/lib/department-hooks"

const GET_DEPARTMENTS = gql`
  query GetDepartments($skip: Int, $take: Int) {
    departments(skip: $skip, take: $take) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`

export function DepartmentList() {
  const [page, setPage] = useState(1)
  const pageSize = 5
  const skip = (page - 1) * pageSize

  const { data, loading, error, refetch } = useQuery(GET_DEPARTMENTS, {
    variables: { skip, take: pageSize },
    fetchPolicy: "network-only",
  })

  const { deleteDepartment, isDeleting } = useDepartmentDelete({
    onSuccess: () => refetch(),
  })

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )

  if (error)
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        Error loading departments: {error.message}
      </div>
    )

  const departments = data?.departments || []

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">All Departments</CardTitle>
        <CardDescription className="text-xs">Manage your organization's departments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="text-xs font-medium">Name</TableHead>
              <TableHead className="text-xs font-medium">Sub-departments</TableHead>
              <TableHead className="text-xs font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm">
                  No departments found. Create your first department to get started.
                </TableCell>
              </TableRow>
            ) : (
              departments.map((department) => (
                <TableRow key={department.id} className="border-gray-100">
                  <TableCell className="font-medium text-sm">{department.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {department.subDepartments.length > 0 ? (
                        department.subDepartments.map((sub) => (
                          <Badge key={sub.id} variant="secondary" className="text-xs font-normal px-1.5 py-0">
                            {sub.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">No sub-departments</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/dashboard/departments/${department.id}`}>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                      <Link href={`/dashboard/departments/${department.id}/edit`}>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Edit className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive"
                        onClick={() => deleteDepartment(department.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 w-8 p-0 text-xs"
              />
            </PaginationItem>
            {[...Array(3)].map((_, i) => {
              const pageNumber = page <= 2 ? i + 1 : page - 1 + i
              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setPage(pageNumber)}
                    isActive={page === pageNumber}
                    className="h-8 w-8 text-xs"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationEllipsis className="h-8 w-8 text-xs" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => p + 1)}
                disabled={departments.length < pageSize}
                className="h-8 w-8 p-0 text-xs"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}
