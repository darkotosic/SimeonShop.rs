import type { NextPage } from 'next';
import Link from 'next/link';

const About: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">SimeonShop.rs</Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-gray-200">Home</Link>
            <Link href="/about" className="hover:text-gray-200 font-bold">About</Link>
            <Link href="/contact" className="hover:text-gray-200">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About SimeonShop.rs</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              SimeonShop.rs is a modern e-commerce platform dedicated to providing high-quality products and exceptional customer service. Founded with a vision to revolutionize online shopping in Serbia, we combine technology with customer care.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To empower customers with a seamless shopping experience through innovative technology, diverse product selection, and dedicated customer support.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Wide selection of quality products</li>
              <li>Fast and reliable delivery</li>
              <li>Excellent customer support</li>
              <li>Secure payment methods</li>
              <li>Competitive pricing</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
