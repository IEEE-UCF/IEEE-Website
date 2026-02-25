import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database/index";
import { Members } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import Signinblock from "@/components/signin";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const dynamic = 'force-dynamic';

export default async function SignInPage() {
  let session = null;
  for (let i = 0; i < 3; i++) {
    session = await getServerSession(authOptions);
    if (session) break;
    await new Promise(r => setTimeout(r, 300 * (i + 1)));
  }

  if (session) {
    if (!session.user.discordId) {
      redirect("/auth/error");
    }

    const [member] = await db
      .select()
      .from(Members)
      .where(eq(Members.discordID, session.user.discordId))
      .limit(1);

    if (member) redirect("/dashboard");
    else redirect("/auth/register");
  }

  return (
    <div className="flex flex-col max-w-screen overflow-x-hidden">
      <div className="relative w-full">
        <div className="flex flex-col w-full relative h-screen items-center [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_40%,#FFC72C_100%)]">
          <div className="px-5 w-full">
            <Navbar />
          </div>
          <div className="flex flex-1 items-center justify-center w-full">
            <Signinblock />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}