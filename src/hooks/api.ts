"use client"

import { useState, useEffect, useCallback } from 'react';
import { useBasic } from '@basictech/react'
import { 
    convertKeysToCamelCase, 
    convertKeysToSnakeCase 
} from '../utils/casing'

const baseUri = `/api/account/${import.meta.env.VITE_BASIC_PROJECT_ID}/db`

interface useApiProps {
    path: string,
    method?: string,
}

interface fetchApiProps {
    token: string,
    path: string,
    method: string,
    body?: any
}

export async function fetchApi({ token, path, method, body }: fetchApiProps) {
    try {
        // Convert request body to snake_case if it exists
        const processedBody = body ? JSON.stringify(convertKeysToSnakeCase(body)) : undefined

        const response = await fetch(`${baseUri}/${path}`, {
            method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: processedBody && method !== 'GET' ? processedBody : undefined
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Response is not JSON");
        }

        const json = await response.json();
        const { data } = json;

        // Convert response data to camelCase
        if (Array.isArray(data)) {
            return data.map((item: any) => ({
                ...convertKeysToCamelCase(item.value),
                id: item.id,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            }));
        }
        return convertKeysToCamelCase(data);
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

export function useApiQuery({ path, method = "GET" }: useApiProps) {
    const basic = useBasic()
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        try {
            const token = await basic.getToken()
            const result = await fetchApi({ token, path, method })
            setData(result)
            setError(null)
            setLoading(false)
        } catch (err: any) {
            setError(err)
            setLoading(false)
        }
    }, [path, method])

    useEffect(() => {
        let isMounted = true

        const doFetch = async () => {
            if (!isMounted) return
            await fetchData()
        }

        doFetch()

        return () => {
            isMounted = false
        }
    }, [fetchData])

    return { data, error, loading, refetch: fetchData }
}

export function useApiMutation({ path, method = "POST" }: useApiProps) {
    const basic = useBasic()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)

    const mutate = async (body: any) => {
        setLoading(true)
        setError(null)
        try {
            const token = await basic.getToken()
            const result = await fetchApi({ 
                token, 
                path, 
                method, 
                body: { value: body }
            })
            setData(result)
            setLoading(false)
            return result
        } catch (err: any) {
            setError(err)
            setLoading(false)
            throw err
        }
    }

    return { mutate, loading, error, data }
}