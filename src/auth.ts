// import CredentialsProvider from "next-auth/providers/credentials"
// import type { AuthOptions } from "next-auth"

// export const authOptions: AuthOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         email: credentials?.email,
//                         password: credentials?.password,
//                     }),
//                 })
//                 const payload = await response.json()
//                 if (!response.ok) {
//                     throw new Error(payload?.message || "Login failed")
//                 }
//                 return {
//                     id: payload?.user?._id,
//                     name: payload?.user?.name,
//                     email: payload?.user?.email,
//                     tokenRes: payload?.token,
//                 } as any
//             },
//         }),
//     ],
//     pages: {
//         signIn: "/login",
//         error: "/login",
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.sub = (user as any).id
//                     ; (token as any).tokenRes = (user as any).tokenRes
//             }
//             return token
//         },
//         async session({ session, token }) {
//             ; (session.user as any).id = token.sub
//                 ; (session as any).tokenRes = (token as any).tokenRes
//             return session
//         },
//     },
// }



import CredentialsProvider from "next-auth/providers/credentials"
import type { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    }),
                })

                const payload = await response.json()
                console.log("SIGNIN PAYLOAD:", payload)
                if (!response.ok) {
                    throw new Error(payload?.message || "Login failed")
                }

                return {
                    id: payload?.user?._id,
                    name: payload?.user?.name,
                    email: payload?.user?.email,
                    tokenRes: payload?.token,

                    // ✅ الجديد: خزّن اليوزر كامل
                    userRes: payload?.user,
                } as any
            },
        }),
    ],

    pages: {
        signIn: "/login",
        error: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sub = (user as any).id
                    ; (token as any).tokenRes = (user as any).tokenRes

                    // ✅ الجديد
                    ; (token as any).userRes = (user as any).userRes
            }
            return token
        },

        async session({ session, token }) {
            ; (session.user as any).id = token.sub
                ; (session as any).tokenRes = (token as any).tokenRes

                // ✅ الجديد
                ; (session as any).userRes = (token as any).userRes

            return session
        },
    },
}
