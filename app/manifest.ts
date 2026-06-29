import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'لوحة تحكم ذكريات الحب',
    short_name: 'ذكريات الحب',
    description: 'لوحة التحكم لإدارة طلبات ومحتوى موقع ذكريات الحب الرومانسية',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#4a0010',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
