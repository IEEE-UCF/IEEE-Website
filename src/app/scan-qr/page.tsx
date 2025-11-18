/**
 * IEEE Member QR Scanner Page
 *
 * This page provides the UI for scanning IEEE member QR codes for event check-in.
 * It uses the useMemberScanner hook for business logic and state management.
 *
 * Dependencies:
 * - @yudiel/react-qr-scanner: React wrapper for QR code scanning
 * - useMemberScanner: Custom hook for scanner logic
 * - Requires HTTPS for camera access (use npm run dev:https)
 *
 * Features:
 * - Live camera QR code scanning
 * - Member information display after scan
 * - Session-based check-in history
 * - Haptic feedback on successful scan
 * 
 * To use
 * - Run the development server with HTTPS: npm run dev:https
 * - Navigate to /scan-qr to access the scanner page
 * - Scan member qr code found on /test-qr page
 */

"use client";
import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useMemberScanner } from "@/components/pg/memberqrcode-scan";

export default function ScanQRPage() {
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

  React.useEffect(() => {
    if (memberInfo) {
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
              eventId: "be1af011-bfe8-46b5-a187-d43ed9322685", // Hardcoded for now
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
  }, [memberInfo]);

  // ============================================
  // RENDER / UI
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* ========== HEADER ========== */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h1 className="text-2xl font-bold text-center mb-2">
            IEEE Member Check-In
          </h1>
          <p className="text-sm text-gray-600 text-center">
            Scan member QR codes to check in
          </p>
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
                {/* 
                  Scanner Component from @yudiel/react-qr-scanner
                  
                  Props:
                  - onScan: Called when QR code is detected (passes result to handleScan)
                  - onError: Called when scanner encounters an error (camera denied, etc.)
                  - constraints: Specifies camera settings
                    - facingMode: "environment" = back camera, "user" = front camera
                  - styles: Custom CSS for the scanner container
                  
                  Note: Requires HTTPS to work on mobile devices
                */}
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: "environment", // Use back camera for scanning
                  }}
                  styles={{
                    container: {
                      width: "100%",
                      height: "100%",
                    },
                  }}
                />

                {/* Visual scanning guide overlay - helps users align QR code */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg"></div>
                </div>
              </div>
            )}

            {/* Cancel button to stop scanning */}
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
          /* Shows after successful scan - displays member details and check-in confirmation */
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

              {/* Member information card */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2">Member Information:</h3>
                <div className="space-y-2">
                  {/* Member ID (always present) */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member ID:</span>
                    <span className="font-mono font-semibold">
                      {memberInfo.id}
                    </span>
                  </div>
                  {/* Additional data from JSON QR codes (name, chapter, etc.) */}
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
                  {/* Check-in timestamp */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">
                      {memberInfo.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Button to scan next member */}
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
        {/* 
          Displays all members scanned during this session
          Only shows if at least one member has been scanned
          Newest scans appear at the top
        */}
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

            {/* Scrollable list of scanned members */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {scanHistory.map((member, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    {/* Display member name if available, otherwise show truncated ID */}
                    <p className="font-semibold">
                      {member.data?.name ||
                        `Member ${member.id.slice(0, 8)}...`}
                    </p>
                    <p className="text-xs text-gray-500">{member.timestamp}</p>
                  </div>

                  {/* Check-in success indicator */}
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
        {/* 
          Shows when scanner is stopped but no member info is displayed
          Provides a button to restart scanning
        */}
        {!isScanning && !memberInfo && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">Ready to scan</p>
            <button
              onClick={resetScanner}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              Start Scanning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
