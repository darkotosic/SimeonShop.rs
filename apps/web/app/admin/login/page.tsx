import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin login',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-12">
      <form className="w-full max-w-md border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-bold text-primary">Admin login</h1>
        <label className="mt-6 block text-sm font-medium text-slate-700">
          Email
          <input type="email" className="mt-2 w-full border border-slate-300 px-3 py-3" />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Lozinka
          <input type="password" className="mt-2 w-full border border-slate-300 px-3 py-3" />
        </label>
        <button className="mt-6 w-full bg-primary px-5 py-3 text-sm font-semibold text-white">Prijavi se</button>
      </form>
    </main>
  );
}
