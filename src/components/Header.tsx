"use client"

import { useBasic } from '@basictech/react'
import { useDataContext } from '../context/DataContext'

export function Header() {
    const { isSignedIn, user, signin, signout } = useBasic()
    const { mode, setMode } = useDataContext()

    return (
        <header className="sticky top-0 z-50 bg-gray-300">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                {isSignedIn ? (
                    <div className="flex items-center gap-4">
                        <p className="m-0">Signed in as: {user?.email}</p>
                        <button onClick={signout} className="btn-primary">Sign Out</button>
                    </div>
                ) : (
                    <button onClick={signin} className="btn-primary">Sign In</button>
                )}
                
                <div className="flex items-center gap-2">
                    <span className="text-sm">API</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={mode === "db"}
                            onChange={() => setMode(mode === "api" ? "db" : "api")}
                        />
                        <div className="w-11 h-6 bg-gray-400 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-sm">DB</span>
                </div>
            </div>
        </header>
    )
}