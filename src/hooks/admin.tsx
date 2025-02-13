import { useBasic } from "@basictech/react";

export function isAdmin(user: any) {
    const emails = import.meta.env.VITE_ADMIN_EMAILS.split(",")
    return user && emails.includes(user.email)
}

export function useIsAdminSignedIn() {
    const basic = useBasic()
    return isAdmin(basic.user)
}