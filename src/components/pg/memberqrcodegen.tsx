"use client";
import React, { useState, useEffect } from "react";
import QRCode from "qrcode";

interface MemberQRCodeProps {
  memberInfo: string;
  size?: number;
  logoUrl?: string;
  logoSize?: number;
}

const MemberQRCode: React.FC<MemberQRCodeProps> = ({
  memberInfo,
  size = 256,
  logoUrl,
  logoSize = Math.floor(size * 0.2), // Default to 20% of QR code size
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const generateQRCode = async (text: string) => {
    try {
      setLoading(true);
      setError("");

      // Generate base QR code
      const qrDataUrl = await QRCode.toDataURL(text, {
        width: size,
        errorCorrectionLevel: "L",
        margin: 2,
      });

      // If no logo, use the QR code as-is
      if (!logoUrl) {
        setQrCodeUrl(qrDataUrl);
        return;
      }

      // Create canvas for logo overlay
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      canvas.width = size;
      canvas.height = size;

      // Load and draw QR code
      const qrImage = new Image();
      qrImage.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        qrImage.onload = resolve;
        qrImage.onerror = reject;
        qrImage.src = qrDataUrl;
      });

      ctx.drawImage(qrImage, 0, 0, size, size);

      // Load and draw logo
      const logoImage = new Image();
      logoImage.crossOrigin = "anonymous"; // Handle CORS for external images

      await new Promise((resolve) => {
        logoImage.onload = resolve;
        logoImage.onerror = () => {
          console.warn("Logo failed to load, using QR without logo");
          resolve(null);
        };
        logoImage.src = logoUrl;
      });

      if (logoImage.complete && logoImage.naturalWidth > 0) {
        // Create circular background for logo
        const centerX = size / 2;
        const centerY = size / 2;
        const logoRadius = logoSize / 2;

        // Draw white circular background
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoRadius + 4, 0, 2 * Math.PI);
        ctx.fill();

        // Draw logo in circle (clipped)
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoRadius, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(
          logoImage,
          centerX - logoRadius,
          centerY - logoRadius,
          logoSize,
          logoSize
        );
        ctx.restore();
      }

      setQrCodeUrl(canvas.toDataURL());
    } catch (err) {
      console.error("QR Code generation error:", err);
      setError("Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code when memberInfo or other dependencies change
  useEffect(() => {
    if (memberInfo) {
      generateQRCode(memberInfo);
    }
  }, [memberInfo, size, logoUrl, logoSize]);

  if (loading) {
    return <div className="flex justify-center p-4">Generating QR Code...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  // Render the QR code image
  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="text-lg font-semibold mb-2">Member QR Code</h3>
      {qrCodeUrl && (
        <img
          src={qrCodeUrl}
          alt="Member QR Code"
          className="border rounded-lg shadow-md"
          data-testid="qr-code-image"
        />
      )}
      <p className="text-sm text-gray-600 mt-2">Scan to access member info</p>
    </div>
  );
};

export default MemberQRCode;
