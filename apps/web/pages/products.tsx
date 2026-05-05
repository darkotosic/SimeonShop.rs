import type { NextPage } from 'next';
import Link from 'next/link';

const Products: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">SimeonShop.rs</Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-gray-200">Home</Link>
            <Link href="/products" className="hover:text-gray-200 font-bold">Products</Link>
            <Link href="/cart" className="hover:text-gray-200">Cart</Link>
            <Link href="/admin/login" className="text-sm hover:text-gray-200">Admin</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Our Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Product {i}</h3>
                <p className="text-gray-600 mb-4">High-quality product</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">${(i * 10).toFixed(2)}</span>
                  <button className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Products;
