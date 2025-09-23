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
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-8 lg:mb-12">
                    <div className="flex items-center lg:gap-x-20">
                        <Link href="/" className="flex-shrink-0">
                            <h1 className="text-xl font-semibold text-white lg:text-4xl">
                                Finance App
                            </h1>
                        </Link>
                        <div className="flex items-center sm:px-8 lg:px-12">
                            <Navigation />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <ClerkLoaded>
                            <div className="h-9 w-9 lg:h-16 lg:w-16 flex items-center justify-center">
                                <UserButton appearance={{
                                    elements: {
                                        avatarBox: "h-full w-full rounded-full",
                                        avatarImage: "rounded-full object-cover",
                                    }
                                }}/>
                            </div>
                        </ClerkLoaded>
                        <ClerkLoading>
                            <div className="h-9 w-9 lg:h-16 lg:w-16 flex items-center justify-center">
                                <Loader2 className="size-7 lg:size-12 animate-spin text-slate-400"/>
                            </div>
                        </ClerkLoading>
                    </div>
                </div>

                {/* Welcome section */}
                <div className="max-w-screen-2xl mx-auto mt-2 lg:mt-4 space-y-2">
                    <h2 className="text-2xl text-white font-medium lg:text-5xl">
                        Welcome User
                    </h2>
                    <p className="text-sm lg:text-lg text-[#89b6fd]">
                        This is your Financial {routeLabel}
                    </p>
                    <Filters/>
                </div>            
            </div>
        </header>
    )
}