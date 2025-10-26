import React from "react";
import MemberQRCode from "@/components/pg/memberqrcode";

const TestPage = () => {
  const memberData = {
    id: "99688747573981184",
    // name: "John Doe",
    // email: "john.doe@email.com",
    // membershipType: "Student",
    // chapter: "UCF",
  };

  const memberInfoString = JSON.stringify(memberData);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">QR Code Testing</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code with IEEE-UCF Logo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              QR Code with IEEE-UCF Logo
            </h2>
            <MemberQRCode
              memberInfo={memberInfoString}
              logoUrl="/iconography/ieeeucficon.png"
              errorCorrectionLevel="M"
            />
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Data:</strong> {memberInfoString}
              </p>
            </div>
          </div>

          {/* QR Code with Icon Logo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">QR Code with Icon</h2>
            <MemberQRCode
              memberInfo=""
              logoUrl="/iconography/ieeeucficon.png"
              logoSize={40}
              errorCorrectionLevel="M"
            />
            <div className="mt-4 text-sm text-gray-600">
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

export default TestPage;
