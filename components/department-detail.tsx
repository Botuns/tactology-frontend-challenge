"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, Loader2, Trash } from "lucide-react";
import { useDepartmentDelete } from "@/lib/department-hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const GET_DEPARTMENT = gql`
  query GetDepartment($id: ID!) {
    department(id: $id) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

export function DepartmentDetail({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { data, loading } = useQuery(GET_DEPARTMENT, {
    variables: { id: Number.parseInt(id) },
    onError: (error) => {
      setError(`Error loading department: ${error.message}`);
    },
  });

  const { deleteDepartment, isDeleting } = useDepartmentDelete({
    onSuccess: () => router.push("/dashboard"),
  });

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  const department = data?.department;

  if (!department)
    return (
      <Alert>
        <AlertDescription>Department not found</AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-5">
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">
                {department.name}
              </CardTitle>
              <CardDescription className="text-xs">
                Department Details
              </CardDescription>
            </div>
            <div className="flex gap-1.5">
              <Link href={`/dashboard/departments/${id}/edit`}>
                <Button variant="outline" className="h-8 text-xs">
                  <Edit className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => deleteDepartment(Number.parseInt(id))}
                disabled={isDeleting}
                className="h-8 text-xs"
              >
                {isDeleting ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash className="mr-1.5 h-3.5 w-3.5" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <h3 className="text-sm font-medium mb-2">Department Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">ID</p>
                <p className="text-sm">{department.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-sm">{department.name}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Sub-Departments</h3>
            {department.subDepartments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100">
                    <TableHead className="text-xs font-medium">ID</TableHead>
                    <TableHead className="text-xs font-medium">Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {department.subDepartments.map((subDept) => (
                    <TableRow key={subDept.id} className="border-gray-100">
                      <TableCell className="text-sm">{subDept.id}</TableCell>
                      <TableCell className="text-sm">{subDept.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-xs text-muted-foreground">
                No sub-departments found for this department
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="h-8 text-xs"
          >
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
