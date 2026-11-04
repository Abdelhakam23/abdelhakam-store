"use client";

import { useState } from "react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const activeImage = images[selected];
  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#eadfd4]">
        {activeImage && <div className="absolute inset-0 bg-cover bg-center transition-all duration-300" style={{ backgroundImage: `url(${activeImage})` }} role="img" aria-label={title} />}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button type="button" key={`${image}-${index}`} onClick={() => setSelected(index)} aria-label={`View image ${index + 1}`} className={`aspect-square overflow-hidden rounded-xl border-2 bg-[#eadfd4] ${selected === index ? "border-[#b98768]" : "border-transparent"}`}>
              <span className="block h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
