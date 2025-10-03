"use client";
import { useEffect, useState } from "react";

export default function Album() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("/api/getAlbum");
      const data = await res.json();
      setImages(data.images);
      setLoading(false);
    };
    fetchImages();
  }, []);

  if (loading) return <p className="text-white text-center">アルバム読み込み中…⏳</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`Album image ${i}`}
          className="w-full h-48 object-cover rounded-md shadow-md"
        />
      ))}
    </div>
  );
}