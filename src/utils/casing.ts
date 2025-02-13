export function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
}

export function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

type CaseConverter = (str: string) => string

function createKeyConverter(convertCase: CaseConverter) {
    return function convertKeys(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(convertKeys)
        }
        
        if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce((result, key) => {
                const convertedKey = convertCase(key)
                const value = obj[key]
                result[convertedKey] = convertKeys(value)
                return result
            }, {} as any)
        }
        
        return obj
    }
}

export const convertKeysToCamelCase = createKeyConverter(toCamelCase)
export const convertKeysToSnakeCase = createKeyConverter(toSnakeCase) 