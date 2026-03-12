import { UserInterface } from "@/app/Interfaces/AuthInterfaces"
import NextAuth, { User } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    export interface Session {
        user: UserInterface
    }
    export interface User {
        userRes: UserInterface
        tokenRes: string
    }
}
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends User {

    }
}