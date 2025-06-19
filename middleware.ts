import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

interface JwtUser {
  userId: string
  email: string
  emailverified: boolean
  telegramConnected: boolean
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value
  const pathname = req.nextUrl.pathname

  // Skip protection for auth pages
  const isSignIn = pathname.startsWith("/sign-in")
  const isSignUp = pathname.startsWith("/sign-up")
  const isVerifyEmail = pathname.startsWith("/sign-up/verify-email")
  const isTelegramConnecting = pathname.startsWith("/sign-up/connect-telegram")

  // No token present
  if (!token) {
    if (!pathname.includes("sign-in") && !pathname.includes("sign-up")) {
      return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin))
    }

    // pathname starts with sign-up/ and atleast one or more characters /sign-up/verify-email
    if (/^\/sign-up\/.+/.test(pathname)) {
      return NextResponse.redirect(new URL("/sign-up", req.nextUrl.origin))
    }

    return NextResponse.next()
  }

  // Verify token
  let user: JwtUser | null = null

  try {
    const verifyUrl = new URL("/api/auth/verify-token", req.nextUrl.origin)
    const res = await axios.post(verifyUrl.toString(), { token })
    user = res.data.payload as JwtUser
  } catch (error) {
    console.error("Token verification failed")
    // Token not verified
    if (!pathname.includes("sign-in") && !pathname.includes("sign-up")) {
      return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin))
    }

    // pathname starts with sign-up/ and atleast one or more characters /sign-up/verify-email
    if (/^\/sign-up\/.+/.test(pathname)) {
      return NextResponse.redirect(new URL("/sign-up", req.nextUrl.origin))
    }

    // go one to designated routes above
    return NextResponse.next()
  }

  if(user.emailverified) {

    if(user.telegramConnected) {
      // stop redirecying to auth pages
      if(isSignIn || isSignUp) {
        return NextResponse.redirect("/")
      }

      return NextResponse.next()
    }
    
    if(!isTelegramConnecting) {
      return NextResponse.redirect(new URL("/sign-up/connect-telegram", req.nextUrl.origin))
    }

    return NextResponse.next()
    // code for preventing going to sign-up/verify-email
  }

  // If user email is not verified, redirect to verification page
  if (!isVerifyEmail) {
    const redirectUrl = new URL("/sign-up/verify-email", req.nextUrl.origin)
    redirectUrl.searchParams.set("email", user.email)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images|$).*)',
    '/',
    '/trpc(.*)',
  ],
}


// import { NextRequest, NextResponse } from "next/server";
// import axios, { AxiosError } from "axios";

// interface JwtUser {
//     userId: string,
//     email: string,
//     emailverified: boolean
// }

// export async function middleware(req: NextRequest) {

//     const cookies = req.cookies
//     const token = cookies.get("auth-token")?.value
//     const pathname = req.nextUrl.pathname

//     let user: JwtUser | null = null;

//     if (token) {

//         try {

//             try {
//                 const fetchUrl = new URL("/api/auth/verify-token", req.nextUrl.origin)
//                 const res = await axios.post(fetchUrl.toString(), {
//                     token
//                 })
//                 // console.log(res.data.payload)
//                 user = res.data.payload as JwtUser
//                 // work with the user payload to check further details

//                 // redirecting users that have verified email to dashboard if they are on sign-up or sign in page
//                 if (!Boolean(user.emailverified) && !pathname.includes("/verify-email")) {
//                     const redirectUrl = new URL("sign-up/verify-email", req.nextUrl.origin)
//                     const fetchUrl = new URL("/api/auth/send-code", req.nextUrl.origin)
//                     const urlSearchParams = redirectUrl.searchParams

//                     // trigger sending email verification
//                     try {
//                         const res = await axios.post(fetchUrl.toString(), {
//                             email: user.email
//                         })
//                         urlSearchParams.set("codeSent", "true")

//                     } catch (error) {
//                         if (error instanceof AxiosError) {
//                             console.log("AxiosError", error.message)
//                         }
//                         // console.log("Error occured", error)
//                     }
                    
//                     urlSearchParams.set("email", user.email)

//                     return NextResponse.redirect(redirectUrl)
//                 }

//                 // if(pathname.includes("/sign-up") || pathname.includes("/sign-in")) {

//                 // }

//                 return NextResponse.next()

//             } catch (error) {
//                 if (error instanceof AxiosError) {
//                     // console.log(error.message)
//                     throw new Error(error.message)
//                 }
//                 throw new Error("Something went wrong")
//             }

//         } catch (error) {
//             console.log(error)
//             // we dont have a verified user
//             if (!pathname.includes("/sign-up") && !pathname.includes("/sign-in")) {
//                 // console.log("redirecting to sign-in")
//                 const redirectUrl = new URL("sign-in", req.nextUrl.origin)
//                 // console.log(redirectUrl.pathname)
//                 return NextResponse.redirect(redirectUrl)
//             }


//             if (/^\/sign-up\/.+/.test(pathname)) {
//                 // protect the verity email route since we dont have email
//                 const redirectUrl = new URL("sign-up", req.nextUrl.origin)
//                 return NextResponse.redirect(redirectUrl)
//             }

//         }
//     }

//     // no token present
//     if (!pathname.includes("/sign-in") && !pathname.includes("/sign-up")) {
//         const redirectUrl = new URL("sign-in", req.nextUrl.origin)
//         return NextResponse.redirect(redirectUrl)
//     }

//     if (/^\/sign-up\/.+/.test(pathname)) {
//         // protect the verity email route since we dont have email
//         const redirectUrl = new URL("sign-up", req.nextUrl.origin)
//         return NextResponse.redirect(redirectUrl)
//     }
// }

// export const config = {
//     matcher: [
//         '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images|$).*)',  // Match all paths except and /api
//         '/',                                    // Match the root path
//         '/trpc(.*)',                            // Match paths starting with /trpc
//     ],
// };