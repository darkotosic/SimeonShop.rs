import type { NextPage } from 'next';
import Link from 'next/link';

const PrivacyPolicy: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-white p-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-2xl font-bold">SimeonShop.rs</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>SimeonShop.rs ("we" or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Personal Data (name, email address, phone number, etc.)</li>
              <li>Payment Information</li>
              <li>Behavioral Data (browsing history, usage patterns)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Use of Information</h2>
            <p>We use collected information for various purposes, including:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Processing and fulfilling orders</li>
              <li>Providing customer support</li>
              <li>Improving our services</li>
              <li>Marketing and promotions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Protection</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@simeonshop.rs</p>
          </section>

          <div className="text-sm text-gray-500 mt-8">
            <p>Last Updated: January 2024</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
