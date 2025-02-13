import { useBasic } from '@basictech/react'
import { useApiMutation } from "./api"
import { useDataContext } from "../context/DataContext"
import { convertKeysToSnakeCase } from '../utils/casing'

interface UseMutationParams {
  collection: "post" | "comment"
  action: "create" | "update"
  id?: string // required for update mutations
}

export function useMutation({ collection, action, id }: UseMutationParams) {
  const { mode } = useDataContext()
  const { db } = useBasic()

  const method = action === "create" ? "POST" : "PATCH"
  const path = action === "update" && id ? `${collection}/${id}` : collection
  const apiMutation = useApiMutation({ path, method })

  const dbCreate = async (body: any) => {
    return db.collection(collection).add(convertKeysToSnakeCase(body))
  }

  const dbUpdate = async (body: any) => {
    return db.collection(collection).update(id, convertKeysToSnakeCase(body))
  }
  
  const mutate = action === "create" ? dbCreate : dbUpdate;
  const dbMutation = { mutate, loading: false, error: null, data: null }

  return mode === "api" ? apiMutation : dbMutation
} 