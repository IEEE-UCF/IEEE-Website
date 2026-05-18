'use client';
import React from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useMemberScanner } from '@/components/pg/memberqrcode-scan';
import { trpc } from '@/lib/trpc/client';

export function QREventScanner() {
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

	const [selectedEventId, setSelectedEventId] = React.useState<string>('');
	const [checkInStatus, setCheckInStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const [checkInError, setCheckInError] = React.useState<string | null>(null);

	const { data: events = [], isLoading: eventsLoading, error: eventsError } = trpc.event.getAll.useQuery();

	const addAttendee = trpc.event.addAttendee.useMutation({
		onSuccess: () => setCheckInStatus('success'),
		onError: (err) => {
			setCheckInStatus('error');
			setCheckInError(err.message);
		},
	});

	// Trigger check-in whenever a member is scanned and event is selected.
	// addAttendee is intentionally omitted from deps — its reference changes every
	// render and including it would cause an infinite loop.
	React.useEffect(() => {
		if (memberInfo && selectedEventId) {
			setCheckInStatus('loading');
			setCheckInError(null);
			addAttendee.mutate({
				eventId: selectedEventId,
				discordId: memberInfo.id,
			});
		}
	}, [memberInfo, selectedEventId]);


	return (
		<div className="bg-ieee-dark-grey/40 p-4 rounded-lg">
			<div className="max-w-2xl mx-auto">
				{/* Header + event selector */}
				<div className="bg-ieee-near-black rounded-lg border border-ieee-dark-grey p-6 mb-4">
					<h1 className="text-2xl font-heading text-white text-center mb-2">IEEE Member Check-In</h1>
					<p className="text-sm text-ieee-light-grey text-center mb-4">
						Select an event and scan member QR codes to check in.
					</p>
					{eventsLoading ? (
						<p className="text-center text-ieee-grey">Loading events...</p>
					) : eventsError ? (
						<p className="text-center text-red-400">{eventsError.message}</p>
					) : (
						<div className="max-w-xs mx-auto">
							<label htmlFor="event-select" className="block text-sm font-subheading text-ieee-light-grey mb-1">
								Select Event
							</label>
							<select
								id="event-select"
								value={selectedEventId}
								onChange={(e) => {
									setSelectedEventId(e.target.value);
									resetScanner();
									setCheckInStatus('idle');
								}}
								className="block w-full pl-3 pr-10 py-2 text-base bg-ieee-dark-grey border-ieee-grey text-white focus:outline-none focus:ring-ieee-bright-yellow focus:border-ieee-bright-yellow sm:text-sm rounded-md"
							>
								<option value="" disabled>-- Please choose an event --</option>
								{events.map((event) => (
									<option key={event.id} value={event.id}>{event.title}</option>
								))}
							</select>
						</div>
					)}
				</div>

				{/* Scanner */}
				{isScanning ? (
					<div className="bg-ieee-near-black rounded-lg border border-ieee-dark-grey p-6 mb-4">
						<h2 className="text-lg font-heading text-white mb-2">Camera Scanner</h2>
						<p className="text-sm text-ieee-light-grey mb-4">Point camera at member&apos;s QR code</p>
						{error ? (
							<div className="bg-red-950 border border-red-800 rounded-lg p-4 mb-4">
								<p className="text-red-400">{error}</p>
							</div>
						) : (
							<div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden border-4 border-ieee-dark-yellow">
								<Scanner
									onScan={handleScan}
									onError={handleError}
									constraints={{ facingMode: 'environment' }}
									styles={{ container: { width: '100%', height: '100%' } }}
								/>
								<div className="absolute inset-0 pointer-events-none">
									<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-ieee-bright-yellow rounded-lg"></div>
								</div>
							</div>
						)}
						<div className="mt-4 text-center">
							<button onClick={() => setIsScanning(false)} className="px-4 py-2 bg-ieee-dark-grey hover:bg-ieee-grey text-white rounded-lg transition-colors">
								Cancel
							</button>
						</div>
					</div>
				) : (
					memberInfo && (
						<div className="bg-ieee-near-black rounded-lg border border-ieee-dark-grey p-6 mb-4">
							{checkInStatus === 'loading' && (
								<div className="text-center mb-4">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-ieee-dark-yellow/20 rounded-full mb-3">
										<svg className="w-8 h-8 text-ieee-dark-yellow animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									</div>
									<h2 className="text-xl font-heading text-ieee-dark-yellow mb-2">Checking In...</h2>
								</div>
							)}
							{checkInStatus === 'success' && (
								<div className="text-center mb-4">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-green-950 rounded-full mb-3">
										<svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<h2 className="text-xl font-heading text-green-400 mb-2">Check-In Successful!</h2>
								</div>
							)}
							{checkInStatus === 'error' && (
								<div className="text-center mb-4">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-red-950 rounded-full mb-3">
										<svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
										</svg>
									</div>
									<h2 className="text-xl font-heading text-red-400 mb-2">Check-In Failed</h2>
									<p className="text-red-400">{checkInError}</p>
								</div>
							)}
							<div className="bg-ieee-dark-grey/50 rounded-lg border border-ieee-dark-grey p-4 mb-4">
								<h3 className="font-subheading text-white mb-2">Member Information:</h3>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-ieee-light-grey">Discord ID:</span>
										<span className="font-mono font-semibold text-white">{memberInfo.id}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-ieee-light-grey">Time:</span>
										<span className="font-semibold text-white">{memberInfo.timestamp}</span>
									</div>
								</div>
							</div>
							<button
								onClick={() => { resetScanner(); setCheckInStatus('idle'); }}
								className="w-full px-4 py-3 bg-ieee-dark-yellow hover:bg-ieee-bright-yellow text-black rounded-lg font-heading transition-colors"
							>
								Scan Next Member
							</button>
						</div>
					)
				)}

				{/* Scan history */}
				{scanHistory.length > 0 && (
					<div className="bg-ieee-near-black rounded-lg border border-ieee-dark-grey p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-heading text-white">Check-In History ({scanHistory.length})</h2>
							<button onClick={clearHistory} className="text-sm text-red-400 hover:text-red-300 transition-colors">Clear</button>
						</div>
						<div className="space-y-2 max-h-64 overflow-y-auto">
							{scanHistory.map((member, index) => (
								<div key={index} className="flex justify-between items-center p-3 bg-ieee-dark-grey/50 rounded-lg border border-ieee-dark-grey">
									<div>
										<p className="font-subheading text-white">{member.data?.name || `Member ${member.id.slice(0, 8)}...`}</p>
										<p className="text-xs text-ieee-grey">{member.timestamp}</p>
									</div>
									<div className="text-green-400">
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Idle state */}
				{!isScanning && !memberInfo && (
					<div className="bg-ieee-near-black rounded-lg border border-ieee-dark-grey p-6 text-center">
						<p className="text-ieee-light-grey mb-4">
							{selectedEventId ? 'Ready to scan for the selected event.' : 'Please select an event to begin scanning.'}
						</p>
						<button
							onClick={resetScanner}
							disabled={!selectedEventId}
							className="px-6 py-3 bg-ieee-dark-yellow hover:bg-ieee-bright-yellow text-black rounded-lg font-heading transition-colors disabled:bg-ieee-grey disabled:text-ieee-dark-grey disabled:cursor-not-allowed"
						>
							Start Scanning
						</button>
					</div>
				)}
			</div>
		</div>
	);
}