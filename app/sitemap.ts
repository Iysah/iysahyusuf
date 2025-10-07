import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://iysahyusuf.com';

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    // Fetch published resources to include dynamic resource detail pages if applicable in future
    // If you later add dynamic routes like /resources/[slug], extend this section accordingly.
    // const res = await fetch(`${baseUrl}/api/resources`);
    // if (res.ok) {
    //   const data = await res.json();
    //   const resourcePaths = (data.resources || []).map((r: any) => ({
    //     url: `${baseUrl}/resources`,
    //     lastModified: new Date(r.updatedAt || r.createdAt || new Date()),
    //     changeFrequency: 'monthly',
    //     priority: 0.6,
    //   }));
    //   routes.push(...resourcePaths);
    // }
  } catch (e) {
    // swallow errors to avoid build-time failure
  }

  return routes;
}