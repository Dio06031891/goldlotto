import type { Metadata } from 'next';
import { env } from '@/lib/utils/env';

export const metadata: Metadata = {
  title: '이용약관',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-muted">
      <h1 className="text-2xl font-bold text-ink">이용약관</h1>
      <p className="mt-4">시행일: 2026년 6월 1일 · {env.SITE_NAME}</p>

      <h2 className="mt-8 text-lg font-bold text-ink">제1조 (목적)</h2>
      <p className="mt-2">
        본 약관은 {env.SITE_NAME}(이하 「서비스」)의 이용 조건 및 운영자와 이용자 간 권리·의무를
        정합니다.
      </p>

      <h2 className="mt-8 text-lg font-bold text-ink">제2조 (서비스 내용)</h2>
      <p className="mt-2">
        서비스는 로또 6/45 관련 정보·계산·통계·콘텐츠를 <strong className="text-ink">참고용</strong>
        으로 제공합니다. 동행복권 공식 서비스가 아니며, 당첨·지급·세무 처리를 대행하지 않습니다.
      </p>

      <h2 className="mt-8 text-lg font-bold text-ink">제3조 (이용자 의무)</h2>
      <ul className="mt-2 list-disc pl-5">
        <li>만 19세 미만은 복권 구매·관련 정보 이용에 제한이 있을 수 있습니다.</li>
        <li>과도한 사행·불법 행위를 해서는 안 됩니다.</li>
        <li>서비스 콘텐츠를 무단 복제·상업 이용하지 않습니다.</li>
      </ul>

      <h2 className="mt-8 text-lg font-bold text-ink">제4조 (면책)</h2>
      <p className="mt-2">
        운영자는 정보의 정확성·완전성·최신성을 보장하지 않습니다. 이용자의 당첨·손실에 대해
        책임지지 않습니다. 자세한 내용은{' '}
        <a href="/disclaimer" className="text-brand underline">
          면책 조항
        </a>
        을 참고하세요.
      </p>

      <h2 className="mt-8 text-lg font-bold text-ink">제5조 (약관 변경)</h2>
      <p className="mt-2">필요 시 약관을 변경할 수 있으며, 변경 내용은 본 페이지에 게시합니다.</p>
    </main>
  );
}
