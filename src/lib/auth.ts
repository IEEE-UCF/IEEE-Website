import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { DrizzleAdapter } from '@auth/drizzle-adapter'; 
import { db } from '@/lib/database/index'; 
import { Accounts, Users, Sessions, Members } from '@/lib/database/schema'; 
import type { DiscordProfile } from "next-auth/providers/discord";
import { eq } from "drizzle-orm";
import { User } from "lucide-react";

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

    async signIn({user, account}) {
      if(account?.provider==="discord" && account.providerAccountId && user.id) {
        try {
          await db.update(Users).set({discordId: account.providerAccountId}).where(eq(Users.id, user.id));

        } catch (e) {
          console.log("DiscordID syncing unfortunately failed ", e);

        }

      }
      return true;

    },

    async session({ session, user }) {
      if (!user) {
        return session;
      }

      try {
        let account = null;
        for(let i=0; i<3; i++) {
          const[foundAccount] = await db
            .select()
            .from(Accounts)
            .where(eq(Accounts.userId, user.id)) // u.id is the providerAccountId
            .limit(1);
          if(foundAccount) {
            account = foundAccount;
            break;

          }
          if (i<2) await new Promise(r => setTimeout(r, 150 * (i+1)));

        }
          
        // sync discordid onto users row
        if (account?.providerAccountId) {
          const [existingUser] = await db
            .select({ discordId: Users.discordId })
            .from(Users)
            .where(eq(Users.id, user.id))
            .limit(1);

          if (!existingUser?.discordId) {
            await db
              .update(Users)
              .set({ discordId: account.providerAccountId })
              .where(eq(Users.id, user.id));
          }
        }


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