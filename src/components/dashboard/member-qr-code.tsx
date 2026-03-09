/**
 * QR Code Test Page
 *
 * This page is used to test and demonstrate the MemberQRCode component.
 * It shows different examples of QR codes with various configurations:
 * - QR code with member data and IEEE-UCF logo
 * - QR code with blank data (error testing)
 *
 * Purpose:
 * - Visual testing of QR code generation
 * - Testing different data formats (JSON member info)
 * - Verifying logo overlay functionality
 * - Quick reference for developers on how to use the component
 *
 * Usage:
 * Navigate to /test-qr to view examples
 * Scan the QR codes with /scan-qr page to test the full flow
 */
"use client";
import React from "react";
import MemberQRCode from "@/components/pg/memberqrcode-gen";
import { trpc } from "@/lib/trpc/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const Member_QR_Code = () => {
	// ============================================
	// SAMPLE DATA
	// ============================================
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

	/**
   * Sample member data object
   *
   * This represents the structure of member information that will be
   * encoded in the QR code. The data is converted to JSON string format.
   *
   * Structure:
   * - id: Unique member identifier (required)
   * - name: Member's full name (optional)
   * - email: Member's email address (optional)
   * - membershipType: Type of membership (optional)
   * - chapter: IEEE chapter name (optional)
   *
   * Note: Only uncommented fields will be included in the QR code
   */
	const memberData = {
		// id: "99688747573981184", // Required: Unique member ID
		id: session.user.discordId,
		// Add other member details as needed
		// name: "John Doe",
		// email: "john.doe@email.com",
		// membershipType: "Student",
		// chapter: "UCF",
	};

	/**
   * Converts member data object to JSON string
   *
   * The QR code scanner expects JSON-formatted data, so we stringify
   * the object here. The scanner will parse this back to an object.
   */
	const memberInfoString = JSON.stringify(memberData);

	// ============================================
	// RENDER / UI
	// ============================================

	return (
		<Card className="max-w-4xl mx-auto px-4 border-2 rounded-xl bg-black shadow-sm shadow-[0_0_20px_rgba(250,204,21,0.5)] text-card-foreground flex flex-col py-6">
			{/* ========== PAGE HEADER ========== */}
			{/* <h1 className="text-3xl font-bold text-center mb-8">QR Code Testing</h1> */}

			{/* ========== QR CODE EXAMPLES GRID ========== */}
			{/*
					Two-column grid on desktop, single column on mobile
					Each card shows a different QR code configuration
				*/}
			{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}
			{/* ========== EXAMPLE 1: QR Code with Member Data ========== */}
			{/*
						This example demonstrates a standard QR code for member check-in
						- Contains JSON member data (id, name, chapter, etc.)
						- Displays IEEE-UCF logo in the center
						- Shows the encoded data below for reference
					*/}
			{/* <div className="bg-white rounded-lg shadow-md p-6"> */}
			{/* <h2 className="text-xl font-semibold mb-4">
							QR Code with IEEE-UCF Logo
						</h2> */}

			{/*
							MemberQRCode Component

							Props:
							- memberInfo: JSON string of member data to encode
							- logoUrl: Path to the logo image to overlay on QR code

							The component will:
							1. Generate a QR code from the memberInfo string
							2. Overlay the IEEE-UCF logo in the center
							3. Use error correction level 'L' for phone-to-phone scanning
						*/}
			<MemberQRCode
				memberInfo={memberInfoString}
				logoUrl="/iconography/ieeeucficon.png"
			/>

			{/* Display the raw data being encoded for debugging */}
			{/* <div className="mt-4 text-sm text-gray-600">
							<p>
								<strong>Data:</strong> {memberInfoString}
							</p>
						</div> */}
			{/* </div> */}
		</Card>
	// </div>
	);
};

// export default Member_QR_Code;
