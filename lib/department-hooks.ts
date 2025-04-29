"use client"

import { useState } from "react"
import { gql, useMutation } from "@apollo/client"

const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: Int!) {
    deleteDepartment(id: $id)
  }
`

interface UseDepartmentDeleteOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useDepartmentDelete(options: UseDepartmentDeleteOptions = {}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const [deleteDepartmentMutation] = useMutation(DELETE_DEPARTMENT, {
    onCompleted: () => {
      setIsDeleting(false)
      if (options.onSuccess) {
        options.onSuccess()
      }
    },
    onError: (error) => {
      setIsDeleting(false)
      if (options.onError) {
        options.onError(error)
      }
    },
  })

  const deleteDepartment = async (id: number | string) => {
    setIsDeleting(true)
    try {
      await deleteDepartmentMutation({
        variables: { id: typeof id === "string" ? Number.parseInt(id) : id },
      })
    } catch (error) {
      // Error is handled by the mutation callbacks
    }
  }

  return { deleteDepartment, isDeleting }
}
