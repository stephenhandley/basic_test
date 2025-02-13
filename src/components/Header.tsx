"use client"

import { useBasic } from '@basictech/react'

export function Header() {
    const { isSignedIn, user, signin, signout } = useBasic()

    return (
        <header className="sticky top-0 z-50 bg-gray-300">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-start items-center">
                {isSignedIn ? (
                    <div className="flex items-center gap-4">
                        <p className="m-0">Signed in as: {user?.email}</p>
                        <button onClick={signout} className="btn-primary">Sign Out</button>
                    </div>
                ) : (
                    <button onClick={signin} className="btn-primary">Sign In</button>
                )}
            </div>
        </header>
    )
}