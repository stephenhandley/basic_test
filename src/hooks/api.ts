"use client"

import { useState, useEffect, useCallback } from 'react';
import { useBasic } from '@basictech/react'

const baseUri = `/api/account/${import.meta.env.VITE_BASIC_PROJECT_ID}/db`

// Utility functions for case conversion
function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
}

function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function convertKeysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(convertKeysToCamelCase)
    }
    
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = toCamelCase(key)
            const value = obj[key]
            result[camelKey] = convertKeysToCamelCase(value)
            return result
        }, {} as any)
    }
    
    return obj
}

function convertKeysToSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(convertKeysToSnakeCase)
    }
    
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((result, key) => {
            const snakeKey = toSnakeCase(key)
            const value = obj[key]
            result[snakeKey] = convertKeysToSnakeCase(value)
            return result
        }, {} as any)
    }
    
    return obj
}

interface useBasicApiProps {
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

export function useBasicQuery({ path, method = "GET" }: useBasicApiProps) {
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

    return { data, error, loading, refresh: fetchData }
}

export function useBasicMutation({ path, method = "POST" }: useBasicApiProps) {
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