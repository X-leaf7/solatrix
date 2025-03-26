/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';

import styles from './styles.module.sass';
import { usePathname } from 'next/navigation';

export function BackgroundSwitcher() {
  const pathname = usePathname();
  const background = pathname === '/' ? 'live' : pathname.split('/')[1];
  const imagePath = `/images/bg-${background}.jpg`;

  const [currentImage, setCurrentImage] = useState(imagePath);

  useEffect(() => {
    const img = new Image();
    img.src = imagePath;

    img.onload = () => setCurrentImage(imagePath);
    img.onerror = () => setCurrentImage((prev) => prev); // Keep the last valid image
  }, [imagePath]);

  return (
    <img
      src={currentImage}
      width='100%'
      alt="Background Image"
      className={styles.background}
    />
  );
}
