import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function check() {
	const { db } = await import("../src/lib/database/client");
	const { Sessions, Users, Members } = await import("../src/lib/database/schema");
	const { eq } = await import("drizzle-orm");

	const sessionToken = "e8e8199a-4aa4-4027-a623-8665584daecf";
	const [session] = await db.select().from(Sessions).where(eq(Sessions.sessionToken, sessionToken));
	console.log("Session found:", session);

	if (session) {
		const [user] = await db.select().from(Users).where(eq(Users.id, session.userId));
		console.log("User found:", user);

		const [member] = await db.select().from(Members).where(eq(Members.userId, session.userId));
		console.log("Member found:", member);
	}
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
