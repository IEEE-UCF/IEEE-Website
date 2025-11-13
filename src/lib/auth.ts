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
          id: "",
          name: profile.username,
          email: profile.email,
          image: profile.avatar 
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
          discordId: profile.id,
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
    async signIn({ user, account, profile }) {
      console.log("=== SIGNIN CALLBACK ===");
      console.log("User:", JSON.stringify(user, null, 2));
      console.log("Account:", JSON.stringify(account, null, 2));
      console.log("Profile:", JSON.stringify(profile, null, 2));
      
      try {
        if (account?.provider === "discord" && profile) {
          const discordProfile = profile as DiscordProfile;
          
          console.log("Discord ID from profile:", discordProfile.id);
          console.log("User ID:", user.id);
          
          // update user with Discord ID
          const result = await db
            .update(Users)
            .set({ discordId: discordProfile.id })
            .where(eq(Users.id, user.id))
            .returning();
            
          console.log("Update result:", result);
          console.log("Discord ID updated successfully");
        }
        
        console.log("SignIn callback returning TRUE");
        return true;
      } catch (error) {
        console.error("=== SIGNIN CALLBACK ERROR ===");
        console.error("Error details:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
        
        return true;
      }
    },
    async session({ session, user }) {
      if (!user) {
        return session;
      }

      try {
        const u = user as User;

        // get Discord ID from Users table
        const [userWithDiscord] = await db
          .select()
          .from(Users)
          .where(eq(Users.id, u.id))
          .limit(1);

        // get member info if exists
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
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
    async redirect({ url, baseUrl }) {
      // handle redirects after sign in
      // if coming from register page, go back there
      if (url.includes('callbackUrl')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const callbackUrl = urlParams.get('callbackUrl');
        if (callbackUrl) {
          return callbackUrl;
        }
      }
      
      // check if user has member profile, middleware stuff
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};