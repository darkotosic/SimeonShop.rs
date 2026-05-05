import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary text-white">
      <nav className="bg-black bg-opacity-50 p-4 sticky top-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">SimeonShop.rs</h1>
          <div className="space-x-4">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/products" className="hover:text-gray-300">Products</Link>
            <Link href="/cart" className="hover:text-gray-300">Cart</Link>
            <Link href="/about" className="hover:text-gray-300">About</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-4">Welcome to SimeonShop.rs</h2>
        <p className="text-xl mb-8">Your premium e-commerce platform</p>
        
        <div className="grid grid-cols-3 gap-6 mt-12">
          <Link href="/products" className="bg-white bg-opacity-10 p-6 rounded-lg hover:bg-opacity-20 transition">
            <h3 className="text-2xl font-bold mb-2">Shop Products</h3>
            <p>Browse our collection</p>
          </Link>
          
          <Link href="/about" className="bg-white bg-opacity-10 p-6 rounded-lg hover:bg-opacity-20 transition">
            <h3 className="text-2xl font-bold mb-2">About Us</h3>
            <p>Learn our story</p>
          </Link>
          
          <Link href="/contact" className="bg-white bg-opacity-10 p-6 rounded-lg hover:bg-opacity-20 transition">
            <h3 className="text-2xl font-bold mb-2">Contact</h3>
            <p>Get in touch</p>
          </Link>
        </div>

        <div className="mt-12 space-y-3">
          <p className="text-sm">API Status: <span id="api-status">Checking...</span></p>
        </div>
      </main>

      <footer className="bg-black bg-opacity-70 text-center p-4 mt-20">
        <p>&copy; 2024 SimeonShop.rs. All rights reserved.</p>
      </footer>

      <script dangerouslySetInnerHTML={{__html: `
        fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/api/v1/health')
          .then(r => r.json())
          .then(d => { document.getElementById('api-status').textContent = '✓ Online'; })
          .catch(e => { document.getElementById('api-status').textContent = '✗ Offline'; });
      `}} />
    </div>
  );
};

export default Home;
