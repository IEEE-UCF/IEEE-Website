/**
 * IEEE Member Scanner Hook
 *
 * Custom React hook that provides QR code scanning functionality for IEEE member check-in.
 * This hook manages all the business logic and state for the scanner, keeping it separate
 * from the UI components.
 *
 * Dependencies:
 * - React hooks (useState)
 *
 * Usage:
 * const scanner = useMemberScanner();
 * // Access: scanner.isScanning, scanner.handleScan(), etc.
 */

'use client';
import { useState } from 'react';

/**
 * Interface for scanned member data
 *
 * @property {string} id - The member's unique ID (from QR code)
 * @property {string} timestamp - When the member was scanned (for check-in record)
 * @property {any} data - Optional additional member data (name, chapter, etc.)
 */
export interface ScannedMember {
	id: string;
	timestamp: string;
	data?: any;
}

/**
 * Custom hook for IEEE member QR code scanning
 *
 * Manages all state and logic for scanning member QR codes:
 * - Scanner on/off state
 * - Scanned data processing (JSON parsing)
 * - Member check-in history
 * - Error handling
 * - Haptic feedback
 *
 * @returns {Object} Scanner state and methods
 */
export function useMemberScanner() {
	// ============================================
	// STATE MANAGEMENT
	// ============================================

	/**
	 * Controls whether the camera scanner is active
	 * - true: Camera is active and scanning
	 * - false: Camera is off, showing results or idle
	 */
	const [isScanning, setIsScanning] = useState(true);

	/**
	 * Stores the raw string data from the scanned QR code
	 * Used for debugging and displaying what was scanned
	 */
	const [scannedData, setScannedData] = useState<string>('');

	/**
	 * Stores the currently scanned member's information
	 * - null: No member scanned yet
	 * - ScannedMember: Contains member ID, timestamp, and optional data
	 */
	const [memberInfo, setMemberInfo] = useState<ScannedMember | null>(null);

	/**
	 * Stores error messages (e.g., camera permission denied)
	 * Empty string means no error
	 */
	const [error, setError] = useState<string>('');

	/**
	 * Array of all members scanned during this session
	 * Newest scans are added to the beginning of the array
	 * Used to display check-in history
	 */
	const [scanHistory, setScanHistory] = useState<ScannedMember[]>([]);

	// ============================================
	// EVENT HANDLERS
	// ============================================

	/**
	 * Handles successful QR code scan
	 *
	 * This function is called by the Scanner component when a QR code is detected.
	 * It processes the scanned data and updates the state accordingly.
	 *
	 * @param {any} result - Result object from the scanner containing the decoded QR data
	 *                       Structure: [{ rawValue: "string data from QR code" }]
	 *
	 * Flow:
	 * 1. Extracts raw string from QR code
	 * 2. Tries to parse as JSON (for structured member data)
	 * 3. Creates member record with ID and timestamp
	 * 4. Adds to scan history
	 * 5. Stops scanner to show results
	 * 6. Triggers haptic feedback (if device supports it)
	 */
	const handleScan = (result: any) => {
		// Check if we got valid scan data
		if (result && result.length > 0) {
			// Extract the actual string data from the QR code
			const rawValue = result[0].rawValue;
			setScannedData(rawValue);
			setError('');

			// Try to parse the QR code data as JSON
			// Our QR generator creates JSON like: {"id":"123","name":"John","chapter":"UCF"}
			try {
				const parsedData = JSON.parse(rawValue);

				// Create a member record with the parsed JSON data
				const member: ScannedMember = {
					id: parsedData.id || rawValue, // Use ID from JSON, fallback to raw string
					timestamp: new Date().toLocaleString(), // Current time for check-in record
					data: parsedData, // Store all the JSON data for display
				};

				// Update state with the scanned member
				setMemberInfo(member);

				// Add to history (newest first)
				setScanHistory((prev) => [member, ...prev]);

				// Stop scanning to show success screen
				setIsScanning(false);

				// Provide haptic feedback on mobile devices (vibration)
				// This gives tactile confirmation that scan was successful
				if (navigator.vibrate) {
					navigator.vibrate(200); // Vibrate for 200ms
				}
			} catch {
				// If parsing fails, the QR code contains plain text (not JSON)
				// Treat the entire string as the member ID
				const member: ScannedMember = {
					id: rawValue, // Use the raw string as the ID
					timestamp: new Date().toLocaleString(),
					// No additional data since it wasn't JSON
				};

				setMemberInfo(member);
				setScanHistory((prev) => [member, ...prev]);
				setIsScanning(false);
			}
		}
	};

	/**
	 * Handles camera/scanner errors
	 *
	 * Common errors:
	 * - User denied camera permission
	 * - Camera not available (no camera on device)
	 * - Camera in use by another application
	 *
	 * @param {any} error - Error object from the scanner
	 */
	const handleError = (err: any) => {
		console.error('QR Scanner Error:', err);
		setError('Camera access denied or not available');
	};

	/**
	 * Resets the scanner to scan another member
	 *
	 * Clears the current scan result and reactivates the camera.
	 * Used after successfully checking in a member.
	 */
	const resetScanner = () => {
		setScannedData('');
		setMemberInfo(null);
		setError('');
		setIsScanning(true); // Reactivate camera
	};

	/**
	 * Clears all check-in history
	 *
	 * Removes all scanned members from the session history.
	 * Does not affect the current scan or scanner state.
	 */
	const clearHistory = () => {
		setScanHistory([]);
	};

	// ============================================
	// RETURN PUBLIC API
	// ============================================

	/**
	 * Returns all state and methods needed by the UI
	 * This is the public API of the hook
	 */
	return {
		// State
		isScanning,
		scannedData,
		memberInfo,
		error,
		scanHistory,

		// Methods
		handleScan,
		handleError,
		resetScanner,
		clearHistory,
		setIsScanning,
	};
}
