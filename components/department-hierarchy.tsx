"use client"

import { useEffect, useRef, useState } from "react"
import { useQuery, gql } from "@apollo/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import * as d3 from "d3"

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

interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
}

export function DepartmentHierarchy() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [error, setError] = useState<string | null>(null)

  const { data, loading } = useQuery(GET_DEPARTMENTS, {
    onError: (error) => {
      setError(`Error loading departments: ${error.message}`)
    },
  })

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: Math.max(500, container.clientWidth * 0.6),
          })
        }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current) return

    // Transform data into hierarchical structure
    const hierarchyData: TreeNode = {
      id: "root",
      name: "Organization",
      children: data.departments.map((dept) => ({
        id: `dept-${dept.id}`,
        name: dept.name,
        children: dept.subDepartments.map((subDept) => ({
          id: `subdept-${subDept.id}`,
          name: subDept.name,
        })),
      })),
    }

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove()

    // Create tree layout
    const margin = { top: 40, right: 120, bottom: 40, left: 120 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    const svg = d3.select(svgRef.current).attr("width", dimensions.width).attr("height", dimensions.height)

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Create hierarchy
    const root = d3.hierarchy(hierarchyData)

    // Create tree layout
    const treeLayout = d3.tree().size([height, width])
    treeLayout(root)

    // Add links
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", (d) => {
        return `M${d.target.y},${d.target.x}
            C${(d.source.y + d.target.y) / 2},${d.target.x}
             ${(d.source.y + d.target.y) / 2},${d.source.x}
             ${d.source.y},${d.source.x}`
      })
      .attr("fill", "none")
      .attr("stroke", "#eee")
      .attr("stroke-width", 1)

    // Add nodes
    const nodes = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", (d) => {
        return `node ${
          d.data.id === "root" ? "node__root" : d.data.id.startsWith("dept") ? "node__branch" : "node__leaf"
        }`
      })
      .attr("transform", (d) => `translate(${d.y},${d.x})`)

    // Add circles to nodes
    nodes
      .append("circle")
      .attr("r", (d) => (d.data.id === "root" ? 6 : 4))
      .attr("fill", (d) => (d.data.id === "root" ? "#000" : d.data.id.startsWith("dept") ? "#333" : "#666"))
      .attr("stroke-width", 1)

    // Add labels to nodes
    nodes
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.children ? -8 : d.data.id === "root" ? -10 : 8))
      .attr("text-anchor", (d) => (d.children ? "end" : d.data.id === "root" ? "end" : "start"))
      .text((d) => d.data.name)
      .attr("font-size", (d) => (d.data.id === "root" ? "0.75rem" : "0.7rem"))
      .attr("font-weight", (d) => (d.data.id === "root" ? "500" : "400"))
      .clone(true)
      .lower()
      .attr("stroke", "white")
      .attr("stroke-width", 2)
  }, [data, dimensions])

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )

  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )

  return (
    <Card className="department-tree shadow-sm border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Department Hierarchy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto">
          <svg ref={svgRef} />
        </div>
      </CardContent>
    </Card>
  )
}
