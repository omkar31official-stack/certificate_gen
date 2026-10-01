import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">About SLUG</h1>
          <p className="mt-4 text-xl text-gray-500">Sapthagiri Libre-Software Users Group</p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-600">
          <p>
            The <strong>Sapthagiri Libre-Software Users Group (SLUG)</strong> is a student-driven open-source community
            dedicated to promoting libre software principles, collaborative development, and technical excellence.
          </p>
          <p>
            We organize workshops, hackathons, seminars, and competitions to help students learn, build, and share
            knowledge across a wide range of technologies including Linux, Git, web development, machine learning, and more.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Mission</h2>
          <ul className="space-y-2">
            <li>Promote open-source software and libre culture among students</li>
            <li>Provide hands-on learning experiences through workshops and hackathons</li>
            <li>Build a community of technically skilled and ethically conscious developers</li>
            <li>Bridge the gap between academic learning and industry practices</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">This Platform</h2>
          <p>
            The SLUG Event & Certificate Automation Platform is our custom-built system for managing events,
            generating certificates, and verifying them publicly using QR codes. Every certificate issued
            through this platform is backed by a unique digital ID and can be independently verified.
          </p>
        </div>

        <div className="mt-16 text-center">
          <Link href="/events" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition shadow-lg">
            Explore Our Events
          </Link>
        </div>
      </div>
    </div>
  );
}
