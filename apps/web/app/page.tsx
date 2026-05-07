import Link from 'next/link';
import { apiFetch, type HealthResponse } from '@/lib/api';

async function getApiStatus() {
  try {
    const health = await apiFetch<HealthResponse>('/api/v1/health');
    return health.status === 'ok' ? 'API online' : 'API nije dostupan';
  } catch {
    return 'API nije dostupan lokalno';
  }
}

export default async function HomePage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <section className="bg-primary text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gold">simeonshop.rs</p>
            <h1 className="mt-4 text-4xl font-bold sm:text-6xl">Simeon Shop</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">
              Klasicna, brza i produkciono spremna e-commerce platforma za prodaju garderobe.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="bg-white px-5 py-3 text-sm font-semibold text-primary">
                Pogledaj proizvode
              </Link>
              <Link href="/checkout" className="border border-white/40 px-5 py-3 text-sm font-semibold text-white">
                Poruči odmah
              </Link>
            </div>
          </div>
          <div className="grid content-end gap-4">
            <div className="border border-white/15 bg-white/10 p-6">
              <p className="text-sm text-slate-200">Status integracije</p>
              <p className="mt-2 text-2xl font-bold">{apiStatus}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {['Brza dostava', 'Sigurna kupovina', 'Kvalitetan materijal', 'Jednostavna porudžbina'].map((item) => (
                <div key={item} className="border border-white/15 bg-white/10 p-4 font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">MVP kolekcija</p>
            <h2 className="mt-2 text-3xl font-bold text-primary">Featured proizvodi</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-secondary">
            Svi proizvodi
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {['Premium majica', 'Duks', 'Trenerka', 'Kacket'].map((name, index) => (
            <article key={name} className="border border-slate-200 bg-white">
              <div className="aspect-square bg-slate-200" />
              <div className="p-4">
                <h3 className="font-semibold text-primary">{name}</h3>
                <p className="mt-1 text-sm text-slate-500">Od {(index + 2) * 1200} RSD</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
