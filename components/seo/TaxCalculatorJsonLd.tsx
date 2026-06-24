import { env } from '@/lib/utils/env';

const pageUrl = `${env.SITE_URL.replace(/\/$/, '')}/calculator/tax`;

export function TaxCalculatorJsonLd() {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '로또 세금 계산기',
    description:
      '로또 6/45 당첨금 세금·1등 실수령액(세후) 계산. 200만 원 비과세, 3억 초과 33% 누진 반영.',
    url: pageUrl,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    inLanguage: 'ko-KR',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
    provider: { '@type': 'Organization', name: env.SITE_NAME, url: env.SITE_URL },
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '로또 1등 당첨금 세금은 얼마인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '구입비 1,000원을 뺀 금액에 대해 3억 원 이하는 22%, 3억 원 초과분은 33%가 적용됩니다. 200만 원 이하는 비과세입니다.',
        },
      },
      {
        '@type': 'Question',
        name: '로또 세금 계산기로 무엇을 알 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '회차·등수별 당첨금 또는 직접 입력한 금액으로 세금과 세후 실수령액을 바로 계산할 수 있습니다.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
