import type { NextPage } from 'next';
import Link from 'next/link';

const AdminDashboard: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button className="hover:bg-secondary px-4 py-2 rounded">Logout</button>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-primary text-white p-4 min-h-screen">
          <nav className="space-y-4">
            <div className="text-gray-200 text-sm font-bold mb-4">MENU</div>
            <Link href="#" className="block p-3 hover:bg-secondary rounded">Dashboard</Link>
            <Link href="#" className="block p-3 hover:bg-secondary rounded">Products</Link>
            <Link href="#" className="block p-3 hover:bg-secondary rounded">Orders</Link>
            <Link href="#" className="block p-3 hover:bg-secondary rounded">Customers</Link>
            <Link href="#" className="block p-3 hover:bg-secondary rounded">Reports</Link>
            <Link href="#" className="block p-3 hover:bg-secondary rounded">Settings</Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <h2 className="text-4xl font-bold mb-8">Welcome, Admin</h2>

          <div className="grid grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 font-bold">Total Revenue</h3>
              <p className="text-3xl font-bold text-primary mt-2">$15,250</p>
              <p className="text-sm text-gray-500 mt-2">↑ 12% from last month</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 font-bold">Total Orders</h3>
              <p className="text-3xl font-bold text-primary mt-2">1,234</p>
              <p className="text-sm text-gray-500 mt-2">↑ 8% from last month</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 font-bold">Total Customers</h3>
              <p className="text-3xl font-bold text-primary mt-2">856</p>
              <p className="text-sm text-gray-500 mt-2">↑ 15% from last month</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 font-bold">Products</h3>
              <p className="text-3xl font-bold text-primary mt-2">342</p>
              <p className="text-sm text-gray-500 mt-2">Active products</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-4">Recent Orders</h3>
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-2">Order ID</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">#123456{i}</td>
                    <td className="p-2">Customer {i}</td>
                    <td className="p-2">${(i * 100).toFixed(2)}</td>
                    <td className="p-2"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Completed</span></td>
                    <td className="p-2">2024-01-{i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
