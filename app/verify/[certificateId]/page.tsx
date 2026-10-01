import { prisma } from "@/lib/database/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default async function CertificateVerificationPage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  
  // This page is public, so no session check needed.
  const certificate = await prisma.certificate.findUnique({
    where: { certificateId },
    include: {
      event: true,
      participant: true,
      template: true,
    }
  });

  if (!certificate) {
    notFound();
  }

  // Log the verification attempt
  try {
    await prisma.verificationLog.create({
      data: {
        certificateId: certificate.id,
      }
    });
  } catch (e) {
    console.error("Failed to log verification", e);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6 text-blue-600 font-black text-2xl tracking-tighter">
            SLUG
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Certificate Verification</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
          <div className="bg-green-50 p-6 border-b border-green-100 flex items-center justify-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-bold text-green-800">Verified Certificate</h2>
          </div>
          
          <div className="p-8 sm:p-12 space-y-8">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Awarded To</p>
              <p className="text-4xl font-bold text-gray-900">{certificate.participant.fullName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b py-8 my-8 border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Event</p>
                <p className="text-lg font-medium text-gray-900">{certificate.event.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Issue Date</p>
                <p className="text-lg font-medium text-gray-900">{new Date(certificate.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Certificate ID</p>
                <p className="text-lg font-mono text-gray-900">{certificate.certificateId}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {certificate.status}
                </span>
              </div>
            </div>

            {certificate.pdfUrl && certificate.pdfUrl !== "sent_via_email" && certificate.pdfUrl !== "pending" && (
              <div className="text-center">
                <a href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition">
                  View Original PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
