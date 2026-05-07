'use client';

import { useMemo, useState } from 'react';
import type { Product, ProductImage } from '@/lib/api';

type GalleryImage = Pick<ProductImage, 'id' | 'image_url' | 'alt_text' | 'sort_order' | 'is_primary'>;

export function getProductImages(product: Product): GalleryImage[] {
  const images = [...(product.images ?? [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order || a.id - b.id);
  if (images.length) return images;
  if (product.image_url) return [{ id: 0, image_url: product.image_url, alt_text: product.name, sort_order: 0, is_primary: true }];
  return [];
}

export function ProductGallery({ product }: { product: Product }) {
  const images = useMemo(() => getProductImages(product), [product]);
  const [activeUrl, setActiveUrl] = useState(images[0]?.image_url ?? null);
  const activeImage = images.find((image) => image.image_url === activeUrl) ?? images[0];

  if (!images.length) {
    return <div className="flex aspect-[4/5] items-center justify-center rounded-3xl bg-slate-100 text-slate-500">Slika proizvoda uskoro</div>;
  }

  return (
    <section className="grid gap-4">
      <img src={activeImage.image_url} alt={activeImage.alt_text ?? product.name} className="aspect-[4/5] w-full rounded-3xl bg-slate-100 object-cover" />
      <div className="grid grid-cols-4 gap-3">
        {images.map((image) => (
          <button key={`${image.id}-${image.image_url}`} type="button" onClick={() => setActiveUrl(image.image_url)} className={`rounded-2xl ring-offset-2 ${image.image_url === activeImage.image_url ? 'ring-2 ring-primary' : ''}`}>
            <img src={image.image_url} alt={image.alt_text ?? product.name} className="aspect-square rounded-2xl bg-slate-100 object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}
