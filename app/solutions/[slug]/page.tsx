import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SolutionPage from '@/components/solutions/SolutionPage';
import { SOLUTIONS, getSolution } from '@/lib/solutions';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return SOLUTIONS.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = getSolution((await params).slug);
  if (!s) return {};
  return {
    title: s.meta.title,
    description: s.meta.description,
    alternates: { canonical: `/solutions/${s.slug}` },
    openGraph: { title: `${s.meta.title} | AGEX TECH`, description: s.meta.description },
  };
}

export default async function Page({ params }: Params) {
  const s = getSolution((await params).slug);
  if (!s) notFound();
  return (
    <>
      <SiteHeader adaptive theme="light" current="solutions" ctaHref={`/contact?building=${encodeURIComponent(s.building)}`} ctaLabel={s.headerCta} />
      <main id="main" className="solution-page">
        <SolutionPage s={s} />
      </main>
      <SiteFooter cta={false} />
    </>
  );
}
