"use client"

import { JSX } from "react"
import { useApiQuery } from "../hooks/api"

interface ApiQueryWrapperProps {
  collection: "post" | "comment"
  children: (query: ReturnType<typeof useApiQuery>) => JSX.Element
}

export function ApiQueryWrapper({ collection, children }: ApiQueryWrapperProps) {
  // useApiQuery always returns the same hook order since it is unconditionally called.
  const query = useApiQuery({ path: collection, method: "GET" })
  return children(query)
} 