"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, QrCode } from "lucide-react";
import Link from "next/link";

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
      }
    } catch {
      alert("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
          <QrCode className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">QR Certificate Scanner</h1>
        <p className="text-gray-500 mb-8">
          Point your camera at the QR code on a certificate to verify it instantly.
        </p>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-8">
          <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <Camera className="w-16 h-16 text-gray-600" />
              </div>
            )}
          </div>
          <div className="p-6">
            {!scanning ? (
              <button onClick={startScanning} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition">
                Open Camera
              </button>
            ) : (
              <button onClick={stopScanning} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition">
                Stop Scanning
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Alternatively, you can <Link href="/verify" className="text-blue-600 hover:underline font-medium">verify using Certificate ID</Link>.
        </p>

        <p className="text-xs text-gray-400 mt-4">
          Note: For full QR decoding, a production deployment will include a JavaScript QR decoder library.
          Currently, mobile devices can use their native camera app to scan the QR and follow the verification link.
        </p>
      </div>
    </div>
  );
}
