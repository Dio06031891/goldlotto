# 황금로또 수익화 로드맵

> 행운템 = **쿠팡 파트너스** / 그 외 = **Google AdSense** (승인 후)  
> 코드는 이미 연결됨. **환경변수만 채우면** 활성화됩니다.

---

## 현재 프로젝트 상태 (2026-06)

| 영역 | 상태 | 비고 |
|------|------|------|
| 당첨번호·회차 SEO | ✅ | `/draw/[no]`, sitemap |
| 세금·사용계획·번호생성·통계 | ✅ | |
| 판매점·1등 명당 | ✅ | 동행복권 API 집계 4,393곳 |
| 가이드·행운템·법적 페이지·PWA | ✅ | |
| **쿠팡 파트너스 (행운템)** | 🔧 코드 완료 | `NEXT_PUBLIC_COUPANG_PARTNERS_ID` 필요 |
| **AdSense** | 🔧 코드 완료 | 승인 + CLIENT_ID + SLOT ID |
| **GA4** | 🔧 코드 완료 | `NEXT_PUBLIC_GA_ID` |
| 도메인·Search Console | ⏳ | `goldenlotto.co.kr` 예정 |
| 명당 482~532회 보완 | ⏳ | API 안정 시 `npm run sync:stores:patch` |

---

## Phase A — 쿠팡 파트너스 (지금 바로 가능)

### A1. 가입

1. [partners.coupang.com](https://partners.coupang.com) 가입 (개인 가능)
2. **사이트 등록** — 도메인 없으면 localhost는 불가, **배포 URL** 또는 임시 도메인 필요
3. **추적 ID** 발급 (예: `AF1234567`)

### A2. 환경변수

`.env.local`:

```env
NEXT_PUBLIC_COUPANG_PARTNERS_ID=AF1234567
```

### A3. 동작 확인

- `/lucky-items/*` — 모든 카드 링크에 `lptag` 적용 (`lib/content/coupang-url.ts`)
- `/draw/[no]` — 하단 **이번 주 행운템** 3개 크로스셀
- 푸터·카테고리 페이지 **파트너스 고지** 표시

### A4. 수익 팁

- 검색 URL보다 **실제 상품 딥링크**(`link.coupang.com/a/ID?redirectUrl=...`)가 전환율 높음
- `content/lucky-items/*.json`의 `coupangUrl`을 파트너스 대시보드에서 복사한 링크로 교체
- 행운템 페이지에는 **AdSense 넣지 않음** (정책·UX)

---

## Phase B — 배포 + Search Console (AdSense 전제)

### B1. 도메인·호스팅

1. 도메인 연결 (`NEXT_PUBLIC_SITE_URL=https://goldenlotto.co.kr`)
2. Vercel 등에 배포, HTTPS 확인

### B2. Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console)
2. 도메인 소유권 — `NEXT_PUBLIC_GOOGLE_VERIFY` 메타 태그 (이미 `layout` metadata 연동)
3. sitemap 제출: `https://[도메인]/sitemap.xml`

### B3. GA4

1. [analytics.google.com](https://analytics.google.com) 속성 생성
2. `.env.local`: `NEXT_PUBLIC_GA_ID=G-XXXXXXXX`
3. 배포 후 Realtime에서 유입 확인

---

## Phase C — AdSense (출시 후 ~6주, 콘텐츠 쌓인 뒤)

### C1. 신청 조건 (Google 기준 요약)

- **자체 도메인** + HTTPS
- **충분한 오리지널 콘텐츠** (가이드, 회차 페이지, 통계 등 — 현재 구조 OK)
- **필수 페이지**: 개인정보, 이용약관, 문의 (`/privacy`, `/terms`, `/contact` ✅)
- **정책**: 당첨번호·계산 **위**에 광고 금지 (코드 배치 준수)

### C2. 신청 절차

1. [adsense.google.com](https://adsense.google.com) 가입
2. 사이트 URL 등록 → **승인 대기** (수일~수주)
3. 승인 후 **광고 단위** 생성 → **슬롯 ID** 발급

### C3. 환경변수 (승인 후)

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_HOME=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_DRAW=...
NEXT_PUBLIC_ADSENSE_SLOT_TAX=...
NEXT_PUBLIC_ADSENSE_SLOT_STATS=...
NEXT_PUBLIC_ADSENSE_SLOT_STORES=...
NEXT_PUBLIC_ADSENSE_SLOT_GUIDE=...
```

→ **CLIENT_ID 또는 SLOT이 비어 있으면 `<AdSenseSlot>`은 렌더하지 않음** (로컬·승인 전 안전)

### C4. 광고 배치 (구현됨)

| 페이지 | 위치 | AdSense |
|--------|------|---------|
| 홈 | 최신 당첨 아래 | ✅ |
| 회차 상세 | 당첨 카드 아래 + 행운템 3 | ✅ + 쿠팡 |
| 세금 계산기 | 결과 **아래** | ✅ |
| **사용 계획** | — | ⛔ 없음 |
| 통계 | 차트 아래 | ✅ |
| 판매점 | 목록 하단 | ✅ |
| 가이드 | 본문 아래 | ✅ |
| **행운템 전체** | — | ⛔ 쿠팡만 |

---

## Phase D — 이전 작업 이어하기 (데이터·운영)

### D1. 명당 1등 횟수 팩트체크

```bash
npm run sync:stores:patch   # 482~532회 보완 (동행복권 API 될 때)
npm run sync:stores:split   # 시도별 JSON 재생성
```

### D2. dev 운영

- 포트 **3040** (`http://localhost:3040`)
- `npm run build`와 `npm run dev` **동시 실행 금지** → `.next` 깨짐
- 문제 시: `npm run dev:clean`

---

## 체크리스트 (순서대로)

- [ ] **1.** 도메인 + Vercel 배포
- [ ] **2.** `.env.local` — SITE_URL, COUPANG_PARTNERS_ID
- [ ] **3.** 쿠팡 파트너스 사이트 승인 + 행운템 링크 실상품 URL로 교체
- [ ] **4.** Search Console + GA4
- [ ] **5.** 2~4주 트래픽·색인 확인
- [ ] **6.** AdSense 신청
- [ ] **7.** 승인 후 ADSENSE_CLIENT_ID + SLOT_* 입력 → 재배포
- [ ] **8.** (선택) 명당 sync patch

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `components/ads/AdSenseSlot.tsx` | 페이지별 광고 슬롯 |
| `components/ads/AdSenseScript.tsx` | layout 스크립트 |
| `components/lucky-items/LuckyItemCard.tsx` | 쿠팡 CTA |
| `components/lucky-items/LuckyItemsTeaser.tsx` | 비-행운템 페이지 크로스셀 |
| `lib/content/coupang-url.ts` | lptag 적용 |
| `lib/utils/ad-slots.ts` | 슬롯 ID 매핑 |
| `.env.example` | 전체 env 목록 |
