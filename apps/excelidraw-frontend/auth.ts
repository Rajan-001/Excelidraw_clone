import NextAuth, { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Twitter from "next-auth/providers/twitter"
import {prismaClient} from "@repo/db/client"
import { JWT_SECRET } from "@repo/backend-common/config"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

//@ts-ignore
export const { handlers, auth, signIn, signOut }:NextAuthConfig = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       authorization: {
        params: {
       prompt: "consent"

        }
      },
    }),
    Twitter({
   // eslint-disable-next-line turbo/no-undeclared-env-vars
   clientId: process.env.AUTH_TWITTER_ID!,
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
      //@ts-ignore
      version: "2.0" 
    })
   
  ],
  secret: process.env.AUTH_SECRET!,
  events:{
    async signIn({ user, account }) {
      if (!user?.email || !account?.provider||!user?.name) return;

      // ✅ Check if email already exists
      const existingUser = await prismaClient.user.findFirst({
        where: { email: user.email },
      });

      if (!existingUser) {
        // ✅ Store only email + provider
         const response= await prismaClient.user.create({
          data: {
            email: user.email,
            provider: account.provider,
            name:user.name
          },
        });
         const token=jwt.sign({userId:response.id},JWT_SECRET);
           (await cookies()).set("token", token, {
        httpOnly: true,
        secure: false, 
        sameSite: "strict",
        maxAge: 3600
      });
   console.log("Rajan ",token)
      } else {
        // ✅ Optional: update provider if user signs in with another provider
        await prismaClient.user.update({
          where: { email: user.email },
          data: { provider: account.provider },
        });
      }
    },
  }
})
