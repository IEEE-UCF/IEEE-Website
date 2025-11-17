import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { DrizzleAdapter } from '@auth/drizzle-adapter'; 
import { db } from '@/lib/index'; 
import { Accounts, Users, Sessions, Members } from '@/lib/schema'; 
import type { DiscordProfile } from "next-auth/providers/discord";
import { eq } from "drizzle-orm";
import type { AdapterUser } from "next-auth/adapters";
import { randomUUID } from "crypto";

interface User extends AdapterUser {
  discordId?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: Users,
    accountsTable: Accounts,
    sessionsTable: Sessions,
  }),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email",
      profile: (profile: DiscordProfile) => {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar 
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
        };
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 10 * 24 * 60 * 60, // 10 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, user }) {
      if (!user) {
        return session;
      }

      try {
        const [account] = await db
          .select()
          .from(Accounts)
          .where(eq(Accounts.userId, user.id)) // u.id is the providerAccountId
          .limit(1);

        // get member info if exists
        const [member] = await db
          .select()
          .from(Members)
          .where(eq(Members.userId, user.id))
          .limit(1);

        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            discordId: account?.providerAccountId || null,
            memberId: member?.id || null,
            officerStatus: member?.officerStatus || false,
            officerRole: member?.officerRole || null,
            administrator: member?.administrator || false,
          },
        };
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },

    // fucking kill myself, this was the stupid bitching fucking solution to a 5 hour long bug session
    // stuuuuupid
    async redirect({ url, baseUrl }) {

       if (url.startsWith("/")) return `${baseUrl}${url}`;
  
        if (url.startsWith(baseUrl)) return url;
        
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};