import TypingText from '@/src/components/ui/shadcn-io/typing-text'
import { ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

export default function Page() {

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="h-full lg:flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-4 pt-16">
                    <h1 className="font-bold text-3xl text-[#2E2A47]">
                        Welcome Back!
                    </h1>
                    <p className="text-base text-[#7E8CA0]">
                        Log in or Create account to get back to dashboard!
                    </p>
                </div>
                <div className="flex items-center justify-center mt-8">
                    <ClerkLoaded>
                    <SignIn path="/sign-in" />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="animate-spin text-muted-foreground"/>
                    </ClerkLoading>
                </div>
            </div>
            <div className="h-full bg-blue-600 hidden lg:flex items-center justify-center">
                    <TypingText
                        text={[
                            "Smart Finance Management",
                            "Track Expenses & Income", 
                            "Secure & Private",
                            "Your Financial Future Starts Here"
                        ]}
                        typingSpeed={70}
                        pauseDuration={2000}
                        showCursor={true}
                        className="text-5xl font-bold leading-tight"
                        textColors={['#ffffff', '#ffffff', '#ffffff', '#ffffff']}
                    />
            </div>
        </div>
    )
}