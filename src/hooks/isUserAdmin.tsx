import { useBasic } from "@basictech/react";

export function isUserAdmin(user: any) {
    return user?.email === import.meta.env.VITE_AUTHOR_EMAIL
}

export function useIsSignedInUserAdmin() {
    const basic = useBasic()
    return isUserAdmin(basic.user)
}