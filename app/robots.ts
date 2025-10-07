import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://iysahyusuf.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/resources'],
        disallow: ['/admin', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}