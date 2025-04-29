"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($input: UpdateDepartmentInput!) {
    updateDepartment(input: $input) {
      id
      name
    }
  }
`;

const CREATE_SUB_DEPARTMENT = gql`
  mutation CreateSubDepartment(
    $departmentId: ID!
    $input: CreateSubDepartmentInput!
  ) {
    createSubDepartment(departmentId: $departmentId, input: $input) {
      id
      name
    }
  }
`;

const DELETE_SUB_DEPARTMENT = gql`
  mutation DeleteSubDepartment($id: Int!) {
    deleteSubDepartment(id: $id)
  }
`;

const formSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  newSubDepartment: z.string().optional(),
});

export function DepartmentForm({ departmentId }: { departmentId?: string }) {
  const router = useRouter();
  const isEditing = !!departmentId;
  const [error, setError] = useState<string | null>(null);
  const [subDepartments, setSubDepartments] = useState<
    Array<{ id?: number; name: string; isNew?: boolean }>
  >([]);

  // Fetch department data if editing
  const { loading: fetchLoading } = useQuery(GET_DEPARTMENT, {
    variables: { id: Number.parseInt(departmentId || "0") },
    skip: !isEditing,
    onCompleted: (data) => {
      if (data?.department) {
        form.setValue("name", data.department.name);
        setSubDepartments(data.department.subDepartments);
      }
    },
    onError: (error) => {
      setError(`Error loading department: ${error.message}`);
    },
  });

  // Create department mutation
  const [createDepartment, { loading: createLoading }] = useMutation(
    CREATE_DEPARTMENT,
    {
      onCompleted: () => {
        router.push("/dashboard");
      },
      onError: (error) => {
        setError(`Error creating department: ${error.message}`);
      },
    }
  );

  // Update department mutation
  const [updateDepartment, { loading: updateLoading }] = useMutation(
    UPDATE_DEPARTMENT,
    {
      onCompleted: () => {
        router.push(`/dashboard/departments/${departmentId}`);
      },
      onError: (error) => {
        setError(`Error updating department: ${error.message}`);
      },
    }
  );

  // Create sub-department mutation
  const [createSubDepartment, { loading: createSubLoading }] = useMutation(
    CREATE_SUB_DEPARTMENT,
    {
      onError: (error) => {
        setError(`Error creating sub-department: ${error.message}`);
      },
    }
  );

  // Delete sub-department mutation
  const [deleteSubDepartment, { loading: deleteSubLoading }] = useMutation(
    DELETE_SUB_DEPARTMENT,
    {
      onError: (error) => {
        setError(`Error deleting sub-department: ${error.message}`);
      },
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      newSubDepartment: "",
    },
  });

  const addSubDepartment = () => {
    const newSubDept = form.getValues("newSubDepartment");
    if (newSubDept) {
      setSubDepartments([...subDepartments, { name: newSubDept, isNew: true }]);
      form.setValue("newSubDepartment", "");
    }
  };

  const removeSubDepartment = async (index: number) => {
    const subDept = subDepartments[index];
    if (subDept.id && !subDept.isNew) {
      try {
        await deleteSubDepartment({
          variables: { id: subDept.id },
        });
      } catch (error) {
        return; // Error is handled by the mutation
      }
    }
    setSubDepartments(subDepartments.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    try {
      if (isEditing) {
        // Update existing department
        await updateDepartment({
          variables: {
            input: {
              id: Number.parseInt(departmentId),
              name: values.name,
            },
          },
        });

        // Add any new sub-departments
        const newSubDepts = subDepartments.filter((sub) => sub.isNew);
        for (const subDept of newSubDepts) {
          await createSubDepartment({
            variables: {
              departmentId: Number.parseInt(departmentId),
              input: {
                name: subDept.name,
              },
            },
          });
        }
      } else {
        // Create new department with sub-departments
        await createDepartment({
          variables: {
            input: {
              name: values.name,
              subDepartments: subDepartments.map((sub) => ({
                name: sub.name,
              })),
            },
          },
        });
      }
    } catch (error) {
      // Errors are handled by the mutation callbacks
    }
  }

  const isLoading =
    fetchLoading ||
    createLoading ||
    updateLoading ||
    createSubLoading ||
    deleteSubLoading;

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {isEditing ? "Edit Department" : "New Department"}
        </CardTitle>
        <CardDescription className="text-xs">
          {isEditing
            ? "Update department details and manage sub-departments"
            : "Create a new department and add sub-departments"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="border-0 text-sm py-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Department Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Finance"
                      {...field}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormItem>
                <FormLabel className="text-xs font-medium">
                  Sub-Departments
                </FormLabel>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {subDepartments.length > 0 ? (
                    subDepartments.map((subDept, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 py-0.5 px-2 text-xs font-normal"
                      >
                        {subDept.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-3.5 w-3.5 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => removeSubDepartment(index)}
                        >
                          <X className="h-2.5 w-2.5" />
                          <span className="sr-only">Remove {subDept.name}</span>
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No sub-departments added yet
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="newSubDepartment"
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          placeholder="e.g. Accounting"
                          {...field}
                          className="h-9 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSubDepartment();
                            }
                          }}
                        />
                      </FormControl>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs"
                    onClick={addSubDepartment}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </div>
                <FormDescription className="text-xs">
                  Add sub-departments to organize your department structure
                </FormDescription>
              </FormItem>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          disabled={isLoading}
          className="h-8 text-xs"
        >
          Cancel
        </Button>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          className="h-8 text-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{isEditing ? "Update Department" : "Create Department"}</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
