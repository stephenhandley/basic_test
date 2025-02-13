"use client"

import { JSX } from "react"
import { useDataContext } from "../context/DataContext"
import { ApiQueryWrapper } from "./ApiQueryWrapper"
import { DbQueryWrapper } from "./DbQueryWrapper"

interface QuerySwitcherProps {
    collection: "post" | "comment"
    children: (query: any) => JSX.Element
}

export function QuerySwitcher({ collection, children }: QuerySwitcherProps) {
    const { mode } = useDataContext()

    const Wrapper = mode === "api" ? ApiQueryWrapper : DbQueryWrapper
    return <Wrapper collection={collection}>{children}</Wrapper>
} 