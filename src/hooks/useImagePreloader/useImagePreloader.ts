import { useState, useEffect } from "react";

export default function useImagePreloader(imageUrls: string[]) {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const promises = imageUrls.map((src) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`)); // Rejects on error
        img.src = src;
      });
    });

    Promise.all(promises)
      .then(() => {
        setImagesLoaded(true);
      })
      .catch((error) => {
        console.error("One or more images failed to preload:", error);
        setImagesLoaded(true);
      });
  }, [imageUrls]);

  return imagesLoaded;
}
