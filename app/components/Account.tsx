"use client"

import Avatar from "../../public/Avatar.png"
import { usePathname } from "next/navigation"
import { useAuthContext } from "../context/AuthContext"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { twMerge } from "tailwind-merge"
import Image from "next/image"

type Props = {}

const Account = (props: Props) => {
    // Check Authentication status
    // register page
    // login page
    // dashboard  // fetch user specific details 

    const { user } = useAuthContext()
    const pathname = usePathname()

    const isSignUp = pathname.includes("/sign-up")
    const isSignIn = pathname.includes("/sign-in")

    return (
        <div>
            {!user?.userId ? (
                <div>
                    {
                        isSignUp && (
                            <Link href={"/sign-in"} className={twMerge(cn(buttonVariants({ variant: "tertiary", size: "sm" })), "h-6")}>login</Link>
                        )
                    }
                    {
                        isSignIn && (
                            <Link href={"/sign-up"} className={cn(buttonVariants({ variant: "tertiary", size: "sm" }), "h-6")}>register</Link>
                        )
                    }
                </div>
            ) : (
                <div>
                    <Image src={Avatar} alt="user icon" width={24} height={24}/>
                </div>
            )}
        </div>
    )
}

export default Account