import type { NextPage } from 'next';
import Link from 'next/link';

const Checkout: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">SimeonShop.rs</Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-gray-200">Home</Link>
            <Link href="/products" className="hover:text-gray-200">Products</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        
        <form className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Billing Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="border p-2 rounded" />
              <input type="text" placeholder="Last Name" className="border p-2 rounded" />
              <input type="email" placeholder="Email" className="col-span-2 border p-2 rounded" />
              <input type="text" placeholder="Address" className="col-span-2 border p-2 rounded" />
              <input type="text" placeholder="City" className="border p-2 rounded" />
              <input type="text" placeholder="Postal Code" className="border p-2 rounded" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-2">
              <label><input type="radio" name="payment" /> Credit Card</label>
              <label><input type="radio" name="payment" /> Bank Transfer</label>
              <label><input type="radio" name="payment" /> PayPal</label>
            </div>
          </div>

          <button type="submit" className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-secondary">
            Place Order
          </button>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
