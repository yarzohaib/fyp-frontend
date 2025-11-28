import { SignupForm } from "@/components/signup-form";



export default function SignupPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left side */}
            <div className="hidden md:flex w-1/2 bg-foreground text-background flex-col items-center justify-center p-8">
                <h2 className="text-5xl font-bold mb-4">Join us!</h2>
                <p className="text-xl text-background/70 text-center">Create your account to get started</p>
            </div>

            {/* Right side - Form */}
            <div className="w-full md:w-1/2 bg-background flex items-center justify-center p-8">
                <SignupForm />
            </div>
        </div>
    )
}
