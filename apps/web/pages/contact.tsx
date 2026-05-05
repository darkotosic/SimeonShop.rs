import type { NextPage } from 'next';
import Link from 'next/link';

const Contact: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">SimeonShop.rs</Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-gray-200">Home</Link>
            <Link href="/contact" className="hover:text-gray-200 font-bold">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-bold">Email</h3>
                <p>info@simeonshop.rs</p>
              </div>
              <div>
                <h3 className="font-bold">Phone</h3>
                <p>+381 (0) 11 123 4567</p>
              </div>
              <div>
                <h3 className="font-bold">Address</h3>
                <p>Belgrade, Serbia</p>
              </div>
              <div>
                <h3 className="font-bold">Hours</h3>
                <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <form className="bg-white rounded-lg shadow-md p-8 space-y-4">
            <div>
              <label className="block font-bold mb-2">Name</label>
              <input type="text" placeholder="Your Name" className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-bold mb-2">Email</label>
              <input type="email" placeholder="Your Email" className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-bold mb-2">Message</label>
              <textarea placeholder="Your Message" rows={5} className="w-full border p-2 rounded"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-secondary">
              Send Message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Contact;
