import type { NextPage } from 'next';
import Link from 'next/link';

const TermsAndConditions: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-white p-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-2xl font-bold">SimeonShop.rs</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on SimeonShop.rs for personal, non-commercial transitory viewing only.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
            <p>The materials on SimeonShop.rs are provided on an 'as is' basis. SimeonShop.rs makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Limitations of Liability</h2>
            <p>In no event shall SimeonShop.rs or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption).</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Accuracy of Materials</h2>
            <p>The materials appearing on SimeonShop.rs could include technical, typographical, or photographic errors. SimeonShop.rs does not warrant that any of the materials on its website are accurate, complete, or current.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Modifications</h2>
            <p>SimeonShop.rs may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of Serbia, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
          </section>

          <div className="text-sm text-gray-500 mt-8">
            <p>Last Updated: January 2024</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;
