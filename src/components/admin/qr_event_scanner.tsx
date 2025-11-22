"use client";
import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useMemberScanner } from "@/components/pg/memberqrcode-scan";
import { type Event } from '@/lib/database/schema';

export function QREventScanner() {
	// ============================================
	// HOOK - Get scanner logic and state
	// ============================================
	const {
		isScanning,
		memberInfo,
		error,
		scanHistory,
		handleScan,
		handleError,
		resetScanner,
		clearHistory,
		setIsScanning,
	} = useMemberScanner();

	const [apiStatus, setApiStatus] = React.useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [apiError, setApiError] = React.useState<string | null>(null);

	const [events, setEvents] = React.useState<Event[]>([]);
	const [selectedEventId, setSelectedEventId] = React.useState<string>("");
	const [eventsLoading, setEventsLoading] = React.useState<boolean>(true);
	const [eventsError, setEventsError] = React.useState<string | null>(null);

	React.useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch("/api/events/getEvents");
				const result = await response.json();
				if (result.success) {
					setEvents(result.data);
				} else {
					setEventsError(result.error || "Failed to fetch events.");
				}
			} catch (error) {
				setEventsError("An error occurred while fetching events.");
				console.error("Error fetching events:", error);
			} finally {
				setEventsLoading(false);
			}
		};

		fetchEvents();

	}, []);

	React.useEffect(() => {
		if (memberInfo && selectedEventId) { // Ensure both are present and selectedEventId is not empty
			const addAttendee = async () => {
				setApiStatus("loading");
				setApiError(null);
				try {
					const response = await fetch("/api/events/addEventAttendee", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							eventId: selectedEventId,
							discordId: memberInfo.id,
						}),
					});

					const result = await response.json();

					if (result.success) {
						setApiStatus("success");
					} else {
						setApiStatus("error");
						setApiError(result.error || "Failed to add attendee.");
					}
				} catch (error) {
					setApiStatus("error");
					setApiError("An error occurred while adding the attendee.");
					console.error("Error adding event attendee:", error);
				}
			};

			addAttendee();
		}
	}, [memberInfo, selectedEventId]);

	// ============================================
	// RENDER / UI
	// ============================================

	return (
		<div className="bg-gray-50 p-4 rounded-lg shadow-md">
			<div className="max-w-2xl mx-auto">
				{/* ========== HEADER ========== */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-4">
					<h1 className="text-2xl font-bold text-center mb-2">
						IEEE Member Check-In
					</h1>
					<p className="text-sm text-gray-600 text-center mb-4">
						Select an event and scan member QR codes to check in.
					</p>

					{eventsLoading ? (
						<p className="text-center text-gray-500">Loading events...</p>
					) : eventsError ? (
						<p className="text-center text-red-500">{eventsError}</p>
					) : (
						<div className="max-w-xs mx-auto">
							<label
								htmlFor="event-select"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Select Event
							</label>
							<select
								id="event-select"
								value={selectedEventId}
								onChange={(e) => {
									setSelectedEventId(e.target.value);
									resetScanner(); // Clear scanned member info when event changes
								}}
								className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
							>
								<option value="" disabled>
									-- Please choose an event --
								</option>
								{events.map((event) => (
									<option key={event.id} value={event.id}>
										{event.title}
									</option>
								))}
							</select>
						</div>
					)}
				</div>

				{/* ========== SCANNER SECTION ========== */}
				{/* Only show if isScanning is true, otherwise show results */}
				{isScanning ? (
					<div className="bg-white rounded-lg shadow-md p-6 mb-4">
						<div className="mb-4">
							<h2 className="text-lg font-semibold mb-2">Camera Scanner</h2>
							<p className="text-sm text-gray-600 mb-4">
								Point camera at member&apos;s QR code
							</p>
						</div>

						{/* Show error message if camera access fails */}
						{error ? (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
								<p className="text-red-700">{error}</p>
							</div>
						) : (
							<div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden border-4 border-blue-500">
								<Scanner
									onScan={handleScan}
									onError={handleError}
									constraints={{
										facingMode: "environment",
									}}
									styles={{
										container: {
											width: "100%",
											height: "100%",
										},
									}}
								/>
								<div className="absolute inset-0 pointer-events-none">
									<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg"></div>
								</div>
							</div>
						)}

						<div className="mt-4 text-center">
							<button
								onClick={() => setIsScanning(false)}
								className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					/* ========== MEMBER INFO DISPLAY ========== */
					memberInfo && (
						<div className="bg-white rounded-lg shadow-md p-6 mb-4">
							{apiStatus === "loading" && (
								<div className="text-center mb-4">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
										<svg
											className="w-8 h-8 text-blue-600 animate-spin"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
									</div>
									<h2 className="text-xl font-bold text-blue-600 mb-2">
										Checking In...
									</h2>
								</div>
							)}

							{apiStatus === "success" && (
								<div className="text-center mb-4">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
										<svg
											className="w-8 h-8 text-green-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<h2 className="text-xl font-bold text-green-600 mb-2">
										Check-In Successful!
									</h2>
								</div>
							)}

							{apiStatus === "error" && (
								<div className="text-center mb-4">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
										<svg
											className="w-8 h-8 text-red-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M6 18L18 6M6 6l12 12"
											></path>
										</svg>
									</div>
									<h2 className="text-xl font-bold text-red-600 mb-2">
										Check-In Failed
									</h2>
									<p className="text-red-700">{apiError}</p>
								</div>
							)}

							<div className="bg-gray-50 rounded-lg p-4 mb-4">
								<h3 className="font-semibold mb-2">Member Information:</h3>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-gray-600">Member ID:</span>
										<span className="font-mono font-semibold">
											{memberInfo.id}
										</span>
									</div>
									{memberInfo.data && (
										<>
											{memberInfo.data.name && (
												<div className="flex justify-between">
													<span className="text-gray-600">Name:</span>
													<span className="font-semibold">
														{memberInfo.data.name}
													</span>
												</div>
											)}
											{memberInfo.data.chapter && (
												<div className="flex justify-between">
													<span className="text-gray-600">Chapter:</span>
													<span className="font-semibold">
														{memberInfo.data.chapter}
													</span>
												</div>
											)}
										</>
									)}
									<div className="flex justify-between">
										<span className="text-gray-600">Time:</span>
										<span className="font-semibold">
											{memberInfo.timestamp}
										</span>
									</div>
								</div>
							</div>

							<button
								onClick={resetScanner}
								className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
							>
								Scan Next Member
							</button>
						</div>
					)
				)}

				{/* ========== SCAN HISTORY ========== */}
				{scanHistory.length > 0 && (
					<div className="bg-white rounded-lg shadow-md p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-semibold">
								Check-In History ({scanHistory.length})
							</h2>
							<button
								onClick={clearHistory}
								className="text-sm text-red-600 hover:text-red-700"
							>
								Clear
							</button>
						</div>

						<div className="space-y-2 max-h-64 overflow-y-auto">
							{scanHistory.map((member, index) => (
								<div
									key={index}
									className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
								>
									<div>
										<p className="font-semibold">
											{member.data?.name ||
												`Member ${member.id.slice(0, 8)}...`}
										</p>
										<p className="text-xs text-gray-500">{member.timestamp}</p>
									</div>
									<div className="text-green-600">
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* ========== IDLE STATE ========== */}
				{!isScanning && !memberInfo && (
					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<p className="text-gray-600 mb-4">
							{selectedEventId
								? "Ready to scan for the selected event."
								: "Please select an event to begin scanning."}
						</p>
						<button
							onClick={resetScanner}
							disabled={!selectedEventId}
							className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							Start Scanning
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
