import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { DrizzleAdapter } from '@auth/drizzle-adapter'; 
import { db } from '@/lib/index'; 
import { Accounts, Users, Sessions, Members } from '@/lib/schema'; 
import type { DiscordProfile } from "next-auth/providers/discord";
import { eq } from "drizzle-orm";
import type { AdapterUser } from "next-auth/adapters";

interface User extends AdapterUser {
  discordId?: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(db, {
    usersTable: Users,
    accountsTable: Accounts,
    sessionsTable: Sessions,
  }),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      // authorization: {params: {scope: "user:email"}},
      profile: (profile: DiscordProfile) => {
        return {
          id: profile.id,
          name: profile.username,
          // email: profile.email,
          image: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`: null,
          discordId: profile.id, // Store Discord ID
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
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord" && profile) {
        const discordProfile = profile as DiscordProfile;
        await db
          .update(Users)
          .set({ discordId: discordProfile.id })
          .where(eq(Users.id, user.id));
      }
      return true;
    },
    async session({ session, user }) {
      if (!user) {
        return session;
      }
      
      const u = user as User;

      // Get Discord ID from Users table
      const [userWithDiscord] = await db
        .select()
        .from(Users)
        .where(eq(Users.id, u.id))
        .limit(1);

      // Get member info if exists
      const [member] = await db
        .select()
        .from(Members)
        .where(eq(Members.userId, u.id))
        .limit(1);

      return {
        ...session,
        user: {
          ...session.user,
          id: u.id,
          discordId: userWithDiscord?.discordId || null,
          memberId: member?.id || null,
          officerStatus: member?.officerStatus || false,
          officerRole: member?.officerRole || null,
          administrator: member?.administrator || false,
        },
      };
    },
  },
};