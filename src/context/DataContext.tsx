"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type DataProviderMode = "api" | "db"

interface DataContextValue {
  mode: DataProviderMode
  setMode: (mode: DataProviderMode) => void
}

const DataContext = createContext<DataContextValue>({
  mode: "db",
  setMode: () => {}
})

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<DataProviderMode>("db")

  return (
    <DataContext.Provider value={{ mode, setMode }}>
      {children}
    </DataContext.Provider>
  )
}

export const useDataContext = () => useContext(DataContext) 