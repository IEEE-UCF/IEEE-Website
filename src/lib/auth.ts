import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";
import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PostgresAdapter(pool),

    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true,
        }),
     ],
    session: {
        strategy: "jwt",
        maxAge: 10*24*60*60
    },
    pages: {
      signIn: "/auth/signin", // page users are redirected to for signing in
      signOut: "/auth/signout", // page users are redirected to for signing in
      error: "/auth/error", // page shown after error
    },

    callbacks: {
        // callback whenever a session is updated or created
        // token is cur jwt
        // user is user object
        // session is session object
        // trigger, indicates what triggered the callback (ex: sign in)
        async jwt({ token, user, session, trigger }) {
            if (user) {
                // await clearStaleTokens(); // Clear up any stale verification tokens from the database after a successful sign in
                return {
                  ...token,
                  id: user.id,
                };
              }
              return token;
        },
        async session({ session, token }) {
            console.log("session callback", { session, token });
            return {
                ...session,
                user: {
                ...session.user,
                id: token.id as string,
              }
            }
        }
    }

};


