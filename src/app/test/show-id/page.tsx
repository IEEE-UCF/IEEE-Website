'use client';
import React from 'react';
import { trpc } from '@/lib/trpc/client';
import MemberQRCode from '@/components/pg/memberqrcodegen';
// import { Navbar } from '@/components/navbar';

const ShowIdPage = () => {
	const { data: session, isLoading, isError } = trpc.auth.getSession.useQuery();

	if (isLoading) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<p className="text-white text-xl">Loading session data...</p>
			</div>
		);
	}

	if (isError || !session?.user?.discordId) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<p className="text-red-500 text-xl">
					Error loading session or Discord ID not found.
				</p>
			</div>
		);
	}

	const memberData = {
		id: session.user.discordId,
		// Add other member details as needed
		// name: "John Doe",
		// email: "john.doe@email.com",
		// membershipType: "Student",
		// chapter: "UCF",
	};

	const memberInfoString = JSON.stringify(memberData);

	return (
		<div className="min-h-screen bg-ieee-black py-8 text-white">
			<div className="max-w-4xl mx-auto px-4">
				<h1 className="mb-8 text-center text-3xl font-heading text-ieee-bright-yellow">
					QR Code Testing
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* QR Code with IEEE-UCF Logo */}
					<div className="rounded-lg border border-ieee-dark-grey bg-ieee-near-black p-6 shadow-md shadow-black/30">
						<h2 className="mb-4 text-xl font-heading">QR Code with IEEE-UCF Logo</h2>
						<MemberQRCode
							memberInfo={memberInfoString}
							logoUrl="/iconography/ieeeucficon.png"
						/>
						<div className="mt-4 text-sm text-ieee-light-grey">
							<p>
								<strong>Data:</strong> {memberInfoString}
							</p>
						</div>
					</div>

					{/* QR Code with no data sent */}
					<div className="rounded-lg border border-ieee-dark-grey bg-ieee-near-black p-6 shadow-md shadow-black/30">
						<h2 className="mb-4 text-xl font-heading">QR Code with Icon</h2>
						<MemberQRCode
							memberInfo=""
							logoUrl="/iconography/ieeeucficon.png"
							logoSize={40}
						/>
						<div className="mt-4 text-sm text-ieee-light-grey">
							<p>
								<strong>Blank</strong>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShowIdPage;
