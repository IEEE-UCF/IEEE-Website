"use client";
import React from "react";
import MemberQRCode from "@/components/pg/memberqrcode-gen";
import { trpc } from "@/lib/trpc/client";
import { Card } from "@/components/ui/card";

export const Member_QR_Code = () => {
	const { data: session, isLoading, isError } = trpc.auth.getSession.useQuery();

	if (isLoading) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<p className="text-white text-xl">Loading session data...</p>
			</div>
		);
	}

	// Use discordId if available, fall back to memberId.
	// discordId may be missing for users who registered before the discord_id
	// migration — it will populate automatically on their next sign-in.
	const qrId = session?.user?.discordId ?? session?.user?.memberId;

	if (isError || !qrId) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<p className="text-red-500 text-xl">
					Session not found. Please sign out and sign back in.
				</p>
			</div>
		);
	}

	const memberData = { id: qrId };
	const memberInfoString = JSON.stringify(memberData);

	return (
		<Card className="max-w-4xl mx-auto px-4 border-2 rounded-xl bg-black shadow-sm shadow-[0_0_20px_rgba(250,204,21,0.5)] text-card-foreground flex flex-col py-6">
			<MemberQRCode
				memberInfo={memberInfoString}
				logoUrl="/iconography/ieeeucficon.png"
			/>
		</Card>
	);
};