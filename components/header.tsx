"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Navigation, routes } from "./navigation";
import { Filters } from "./filters";
import { ClerkLoaded, UserButton, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";


export const Header = () => {

    const pathname = usePathname()

    const currentRoute = routes.find(route => route.href === pathname)
    const routeLabel = currentRoute?.label || "Dashboard"

    return (
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-4 lg:px-14 pb-24">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                <div className="w-full flex items-center justify-between mb-14">
                    <div className="flex items-center lg:gap-x-16">
                        <Link href="/" className="flex-shrink-0">
                            <h1 className="text-xl font-semibold text-white lg:text-3xl">
                                Finance App
                            </h1>
                        </Link>

                        <div className="flex items-center sm:px-8">
                            <Navigation />
                        </div>
                        <ClerkLoaded>
                            <UserButton afterSignOutUrl="/"/>
                        </ClerkLoaded>
                        <ClerkLoading>
                            <Loader2 className="size-8 animate-spin text-slate-400"/>
                        </ClerkLoading>
                    </div>

                {/* Auth here */}

                </div>
                
            </div>

            <div className="max-w-screen-2xl mx-auto mt-6 space-y-2 lg:mt-10">
                <h2 className="text-2xl text-white font-medium lg:text-4xl">
                    Welcome User
                </h2>
                <p className="text-sm lg:text-base text-[#89b6fd]">
                This is your Financial {routeLabel}
                </p>
                <Filters/>
            </div>            
        </header>
    )
}