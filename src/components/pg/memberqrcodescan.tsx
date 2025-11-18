"use client";
import React, { useState, useEffect } from "react";
import QrReader from "qrcode";

const Test = (props) => {
  const [qrResult, setQrResult] = useState<string>("no result");

  return (
    <>
      <QrReader
        onScan={(data) => {
          if (data) {
            setQrResult(data);
          }
        }}
        onError={(err) => {
          console.error(err);
        }}
      />
      <p>QR Code Result: {qrResult}</p>
    </>
  );
};

export default Test;
