import type { NextPage } from 'next';
import Link from 'next/link';

const Cart: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">SimeonShop.rs</Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-gray-200">Home</Link>
            <Link href="/products" className="hover:text-gray-200">Products</Link>
            <Link href="/cart" className="hover:text-gray-200 font-bold">Cart</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link href="/products" className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-secondary">
            Continue Shopping
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold mb-2">Order Summary</h3>
            <p className="text-gray-600">Subtotal: $0.00</p>
            <p className="text-gray-600">Shipping: $0.00</p>
            <p className="text-gray-600">Tax: $0.00</p>
            <p className="font-bold text-lg mt-2">Total: $0.00</p>
          </div>
          
          <Link href="/checkout" className="bg-primary text-white rounded-lg shadow-md p-6 hover:bg-secondary transition flex items-center justify-center">
            <span className="text-xl font-bold">Proceed to Checkout</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Cart;
