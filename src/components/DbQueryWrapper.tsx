"use client"

import { JSX } from "react"
import { useBasic, useQuery } from "@basictech/react"
import { convertKeysToCamelCase } from "../utils/casing"

interface DbQueryWrapperProps {
  collection: "post" | "comment"
  children: (query: {
    data: any
    error: any
    isLoading: boolean
    refetch: () => void
    // you can add other properties if needed
  }) => JSX.Element
}

export function DbQueryWrapper({ collection, children }: DbQueryWrapperProps) {
  const { db } = useBasic()

  const data = useQuery(async () => {
    const result = await db.collection(collection).getAll()
    return convertKeysToCamelCase(result);
  })

  const hasData = !!data;
  const result = { data: hasData ? data : [], error: undefined, isLoading: !hasData, refetch: () => {} }
  
  return children(result)
} 