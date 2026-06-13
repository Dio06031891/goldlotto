import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GuideMarkdown } from '@/components/content/GuideMarkdown';
import { AdSenseSlot } from '@/components/ads/AdSenseSlot';
import { GuideJsonLd } from '@/components/seo/GuideJsonLd';
import { GUIDE_SLUGS, getGuideBySlug } from '@/lib/content/guides';

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return { title: '가이드' };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guide/${guide.slug}` },
    openGraph: { title: guide.title, description: guide.description },
  };
}

export default function GuideArticlePage({ params }: PageProps) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <GuideJsonLd guide={guide} />
      <Link href="/guide" className="text-sm font-semibold text-brand hover:underline">
        ← 가이드 목록
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-3 text-sm text-muted">약 {guide.readMinutes}분 · 참고용 정보</p>
      <GuideMarkdown content={guide.body} />
      <AdSenseSlot slot="guide" />
      <div className="mt-12 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs text-amber-950">
        본 글은 일반 정보이며 법률·세무 자문이 아닙니다.{' '}
        <Link href="/calculator/tax" className="font-bold underline">
          세금 계산기
        </Link>
        로 금액을 시뮬레이션해 보세요.
      </div>
    </main>
  );
}
