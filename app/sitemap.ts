import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { SOLUTIONS } from '@/lib/solutions';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    ...SOLUTIONS.map(s => ({ url: `${SITE_URL}/solutions/${s.slug}`, changeFrequency: 'monthly' as const, priority: 0.9 })),
    { url: `${SITE_URL}/deployments`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE_URL}/contact/investors`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
