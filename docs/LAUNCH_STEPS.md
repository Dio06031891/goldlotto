# 출시·수익화 스텝 체크리스트

> Cursor Agent와 함께 **한 단계씩** 진행. 완료하면 `[x]`로 표시.

**도메인:** `goldenlotto.co.kr` ✅ ([호스팅케이알](https://www.hosting.kr/)에서 구매)

---

## Step 0 — 로컬 점검

- [x] `npm run test` (61 tests)
- [x] `npm run build` 성공
- [ ] `http://localhost:3040` 주요 페이지 수동 확인

---

## Step 1 — 출시 전 코드 (AdSense·신뢰)

- [x] AdSenseSlot React hooks lint 수정
- [x] 개인정보처리방침 AdSense·쿠키 문단 보강
- [x] `/about` 운영·수익 구조 고지
- [x] **본인:** 문의 이메일 → `6sik7192@gmail.com`

---

## Step 2 — 환경변수

### 로컬 (`.env.local` — 이미 생성됨)

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3040
NEXT_PUBLIC_SITE_NAME=황금로또
NEXT_PUBLIC_CONTACT_EMAIL=6sik7192@gmail.com
```

### Vercel Production

```env
NEXT_PUBLIC_SITE_URL=https://goldenlotto.co.kr
NEXT_PUBLIC_SITE_NAME=황금로또
NEXT_PUBLIC_CONTACT_EMAIL=6sik7192@gmail.com
```

출시 직후:

```env
NEXT_PUBLIC_COUPANG_PARTNERS_ID=AFxxxxxxx
NEXT_PUBLIC_GA_ID=G-xxxxxxxx
NEXT_PUBLIC_GOOGLE_VERIFY=...   # Search Console
```

AdSense 승인 **후**:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-...
NEXT_PUBLIC_ADSENSE_SLOT_HOME=...
# draw, tax, stats, stores, guide, generator
```

---

## Step 3 — 행운템 쿠팡 (20~30개 + 상세페이지)

- [x] 상품 상세페이지 `/lucky-items/item/[slug]` 코드
- [ ] 쿠팡 파트너스 가입·사이트 승인 (`https://goldenlotto.co.kr`)
- [x] 실상품 22개 + 파트너스 **딥링크** → `content/lucky-items/*.json` (2026-06 엑셀 반영)
- [x] 행운템 목록·카테고리 UI 업데이트 (상품 수·쿠팡 연결 안내)

**예시 상세:** `/lucky-items/item/golden-dragon-guardian`

---

## Step 3b — GitHub Actions 자동화 (배포 후)

GitHub에 push하면 아래가 자동으로 돌아갑니다.

| 워크플로 | 파일 | 하는 일 |
|---------|------|--------|
| **CI** | `.github/workflows/ci.yml` | push/PR마다 lint·test·build |
| **주간 동기화** | `.github/workflows/sync-weekly.yml` | 매주 일요일 02:00 KST — 명당 JSON 증분 sync → commit → Vercel 재배포 |

### 명당 vs 통계 — 무엇이 자동?

| 데이터 | 출처 | 자동화 |
|--------|------|--------|
| **당첨번호 통계** | 동행복권 API (사이트가 1시간마다 fetch) | 별도 JSON 불필요 — **배포만 하면 항상 최신** |
| **명당 1등 횟수** | `data/stores/*.json` | **주 1회 GitHub Actions**가 신규 회차만 추가 |

로컬 수동 실행:

```bash
npm run verify:lotto              # API·메타 상태 점검
npm run sync:stores:incremental   # 신규 회차만 명당 반영
```

Actions에서 수동 실행: GitHub → **Actions** → **Weekly lotto data sync** → **Run workflow**

**필요 조건:** repo가 GitHub에 push되어 있고, `main` 브랜치에 `contents: write` 권한(기본 workflow 토큰)이 있어야 commit/push가 됩니다.

---

## Step 4 — 배포 + DNS (호스팅케이알)

> **웹호스팅은 호스팅케이알에서 살 필요 없음.** Vercel이 사이트를 호스팅하고, 호스팅케이알은 **도메인 + DNS만** 관리.

- [ ] GitHub push
- [ ] [vercel.com](https://vercel.com) → Import 프로젝트
- [ ] Vercel Environment Variables (Production) 입력 — Step 2 참고
- [ ] Vercel → Settings → Domains → `goldenlotto.co.kr`, `www.goldenlotto.co.kr` 추가
- [ ] [호스팅케이알](https://www.hosting.kr/) DNS 레코드 설정 (아래)

### 호스팅케이알 DNS 설정 순서

1. [hosting.kr](https://www.hosting.kr/) 로그인
2. **나의 서비스** → **도메인** → `goldenlotto.co.kr` 선택
3. **DNS 관리** / **DNS 레코드 설정** / **고급 DNS** 메뉴 진입  
   (메뉴명은 버전마다 `DNS 설정`, `네임서버·DNS` 등으로 다를 수 있음)
4. **도메인 포워딩·파킹**이 켜져 있으면 **끄기** — Vercel 연결과 충돌함
5. **네임서버**는 호스팅케이알 기본값 유지 (Vercel로 바꿀 필요 없음)
6. 아래 레코드 **추가** (기존 A/CNAME과 겹치면 Vercel 값으로 **수정**)

| 타입 | 호스트(이름) | 값 | TTL |
|------|-------------|-----|-----|
| **A** | `@` (또는 비움·루트) | `76.76.21.21` | 3600 (기본) |
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 |

- `.co.kr` 화면에서 호스트를 `@` 대신 **비워두거나** `goldenlotto.co.kr`로 쓰라고 나오면 그 UI 안내 따르기
- Vercel Domains 화면에 **다른 IP/CNAME**이 나오면 **Vercel 값을 우선** (프로젝트마다 다를 수 있음)
- `www` → 루트 리다이렉트: Vercel Domains에서 **Redirect www to apex** 설정
- 저장 후 전파: **10분~2시간** (최대 48시간)
- Vercel Domains에 **Valid Configuration** 뜨면 SSL(HTTPS) 자동 발급

### 연결 확인

- [ ] `https://goldenlotto.co.kr` 접속
- [ ] `https://goldenlotto.co.kr/sitemap.xml`
- [ ] `https://goldenlotto.co.kr/contact` → `6sik7192@gmail.com` 표시

### DNS가 안 붙을 때

- 호스팅케이알 고객센터: **1644-7378**
- Vercel Domains에 표시된 **정확한 레코드 값** 캡처해서 문의하면 빠름

**상세 가이드:** `docs/DNS_HOSTING_KR.md`

---

## Step 5 — 쿠팡 활성화

- [ ] `COUPANG_PARTNERS_ID` Vercel 반영 → 재배포
- [ ] `/lucky-items/this-week` 링크에 lptag 확인

---

## Step 6 — Search Console + GA4

- [ ] [search.google.com/search-console](https://search.google.com/search-console) → `goldenlotto.co.kr` 등록
- [ ] sitemap: `https://goldenlotto.co.kr/sitemap.xml` 제출
- [ ] GA4 Realtime 유입 확인

---

## Step 7 — 콘텐츠 SEO (2~4주)

- [ ] 가이드 1~2편 추가
- [x] 명당 주간 자동 sync (`.github/workflows/sync-weekly.yml`)
- [ ] 명당 실패 회차 보완 (`npm run sync:stores:patch`) — 필요 시

---

## Step 8 — AdSense 신청 (출시 4~6주 후)

- [ ] [adsense.google.com](https://adsense.google.com) 신청 (사이트 URL: `https://goldenlotto.co.kr`)
- [ ] 승인 후 SLOT env → 재배포

---

## Step 9 — SNS (유료 광고 전)

- [ ] 인스타/숏폼 **무료** 운영 (토요일 추첨 콘텐츠)
- [ ] bio → `https://goldenlotto.co.kr`

---

**현재 위치:** Step 2 완료 → **Step 4 Vercel 배포 + DNS** 진행 가능.
