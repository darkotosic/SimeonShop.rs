import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin dashboard',
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-primary">Admin dashboard</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          ['Porudzbine', '0 novih'],
          ['Proizvodi', '0 aktivnih'],
          ['Kategorije', '0 aktivnih'],
        ].map(([label, value]) => (
          <section key={label} className="border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
