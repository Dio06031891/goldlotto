# 🎰 황금로또 (Goldlotto) — Cursor 통합 작업지시서

> **프로젝트명**: 황금로또 (Goldlotto)
> **도메인**: `goldenlotto.co.kr` (구매 예정, 문서 내 `[DOMAIN]`으로 참조)
> **타깃 플랫폼**: PWA 우선 (Next.js 14), 추후 TWA → iOS 네이티브
> **기획**: Claude Opus (2026.05)
> **개발**: Cursor + Claude Code
> **문서 버전**: v1.0 (통합본)
> **작성일**: 2026-05-11

---

## 📑 목차

이 문서는 9개 섹션의 통합본입니다. 각 섹션은 독립적으로 읽을 수 있고, 필요한 부분만 찾아 활용할 수 있습니다.

- **§0. 시작하기** — Cursor에게 주는 작업 지침과 절대 규칙
- **§1. PRD (제품 요구사항)** — 무엇을 만들 것인가 (SSOT)
- **§2. 기술 스택 & 폴더 구조** — 어떻게 만들 것인가
- **§3. W1 셋업 작업** — Cursor 첫 작업 (이거부터 시작)
- **§4. W2~W9 마일스톤** — 출시까지의 전체 일정
- **§5. SEO 구현 가이드** — 매출의 70%가 걸린 부분
- **§6. 광고/수익화 구현** — AdSense + 쿠팡 파트너스
- **§7. 콘텐츠 페이지 템플릿** — 가이드/회차/행운템 구조
- **§8. 함정 및 주의사항** ⚠️ — 시간 낭비 방지 (반드시 읽기)

---

## 🚀 Cursor에게 줄 첫 프롬프트

새 Cursor 세션을 열고 이 파일과 함께 다음 프롬프트를 던지세요:

```
나는 황금로또 PWA 프로젝트를 시작한다.
이 폴더의 CURSOR_BRIEF.md를 모두 읽고 SSOT(Single Source of Truth)로 삼아줘.
특히 §0의 절대 규칙과 §8의 함정 목록을 반드시 숙지해줘.

이제 §3 (W1 셋업)의 작업을 W1.1부터 순서대로 진행한다.
한 단계 끝날 때마다 결과 보여주고 확인 받은 후 다음으로 진행해줘.

W1.1: Next.js 14 프로젝트 생성부터 시작.
```

---



# §0. 시작하기

> **프로젝트명**: 황금로또
> **도메인**: `[DOMAIN]` (출시 전 확정 예정 — 코드 내 `process.env.NEXT_PUBLIC_SITE_URL`로 참조)
> **타깃 플랫폼**: PWA 우선 (Next.js 14), 추후 TWA → iOS 네이티브
> **기획**: Claude Opus (2026.05)
> **개발**: Cursor + Claude Code

---

## 🎯 이 문서를 어떻게 사용해야 하나

**Cursor에게:** 이 폴더의 모든 `.md` 파일을 SSOT(Single Source of Truth)로 삼는다. 작업 시작 전 반드시 `00_README.md`(이 파일)부터 `08_GOTCHAS.md`까지 모두 읽고 컨텍스트로 보관.

**작업 진행 순서:**
1. `01_PRD.md` — 무엇을 만드는지 이해
2. `02_TECH_STACK.md` — 어떻게 만드는지 이해
3. `08_GOTCHAS.md` — 함정 미리 숙지 (이거 안 보면 시간 낭비함)
4. `03_W1_SETUP.md` — W1 작업 시작
5. `04_MILESTONES.md` — W2 이후 작업
6. 필요시 `05~07` 참조

---

## 📁 문서 목차

| # | 파일 | 내용 | 우선순위 |
|---|---|---|---|
| 00 | `README.md` | 이 파일 — 전체 가이드 | ⭐⭐⭐ |
| 01 | `PRD.md` | 제품 요구사항 (SSOT) | ⭐⭐⭐ |
| 02 | `TECH_STACK.md` | 기술 스택 + 폴더 구조 | ⭐⭐⭐ |
| 03 | `W1_SETUP.md` | W1 셋업 작업 | ⭐⭐⭐ |
| 04 | `MILESTONES.md` | W2~W9 마일스톤 | ⭐⭐ |
| 05 | `SEO_GUIDE.md` | SEO 구현 가이드 | ⭐⭐ |
| 06 | `MONETIZATION.md` | 광고/수익화 구현 | ⭐⭐ |
| 07 | `CONTENT_TEMPLATES.md` | 콘텐츠 페이지 템플릿 | ⭐ |
| 08 | `GOTCHAS.md` | 함정 및 주의사항 | ⭐⭐⭐ |

---

## 🚀 빠른 시작 (Cursor에게)

새 세션에서 이 프로젝트 작업을 처음 시작한다면:

```
이 폴더의 모든 .md 파일을 읽었지?
나는 황금로또 프로젝트의 W1 셋업 작업을 시작할 거야.
03_W1_SETUP.md의 산출물을 순서대로 만들어줘.
```

---

## 📌 절대 규칙 (위반 시 PR 거절)

1. **모든 화폐 단위는 `number` (정수, 원). `BigInt` 또는 `Decimal` 사용 금지. `float` 금지.**
2. **세금 계산은 `lib/core/tax/calculator.ts` 단일 파일의 순수 함수로.**
3. **동행복권 API 직접 호출 금지.** 항상 `LottoRepository` 인터페이스 경유. 직접 호출 시 IP 차단 위험.
4. **AdSense 광고 코드는 환경변수 분기.** `NEXT_PUBLIC_ADSENSE_CLIENT_ID` 비어있으면 광고 영역 자체를 숨김.
5. **사용자 개인정보(내 번호, 사용 계획)는 IndexedDB만.** Firestore에 절대 저장 X.
6. **모든 페이지에 메타데이터 + Open Graph 필수.** SEO가 매출의 70%.
7. **새 기능 commit 시 §번호 표시.** 예: `feat(§2.3): add wishlist multi-add`
8. **모르면 추측하지 말고 사용자에게 질문.**

---

## 🎁 핵심 차별화 기능 (이 셋이 우리 무기)

1. **세금 계산기** (§2.2) — 세전→세후 정확 계산
2. **사용 계획 계산기** (§2.3) ⭐ — 카테고리별 당첨금 시뮬레이션
3. **행운템 코너** (§4.5) — 쿠팡 파트너스 연결

이 셋은 경쟁사 대부분이 안 함. 여기에 SEO + 수익화 다 걸려있음.

---

## 📊 성공 지표 (KPI)

| 기간 | MAU 목표 | 색인 페이지 | 월 수익 목표 |
|---|---|---|---|
| 출시 ~ 1개월 | 1,000~2,000 | 200~500 | 0~3만원 |
| 3개월 | 5,000 | 1,000+ | 5~20만원 |
| 6개월 | 10,000~30,000 | 1,500+ | 50~250만원 |
| 12개월 | 30,000~100,000 | 2,000+ | 200~1,000만원 |

> 솔직한 현실: 6개월 적자 각오 필요. 1년 후에야 의미 있는 수익. 80%의 개인 사이트가 6개월 내 실패하니 마인드셋부터 준비.

---

## 🔄 v1 → v2 → v3 변경 이력

- **v1**: Flutter 앱 (안드로이드+iOS) 기획
- **v2**: PWA(Next.js)로 전환 — "앱 안 받는 사용자가 더 많다" 통찰 반영
- **v3 (현재)**: 수익화 현실화 + 통계/판매점 정식 기능 + AdSense 승인 절차 반영 + 도메인 황금로또 + 번호 생성기 4모드 추가

각 변경 사유는 `01_PRD.md` §0 참조.

# §1. PRD (제품 요구사항)

> **SSOT (Single Source of Truth)**: 코딩 중 사양 충돌이 발생하면 이 문서를 우선.

---

## §0. 프로젝트 개요

### 한 줄 정의
매주 로또 6/45 당첨번호를 실시간 조회·푸시 알림하고, 세전·세후 당첨금 계산, 사용 계획 시뮬레이션, 회차별 통계 분석, 1등 명당 탐색, 번호 자동 생성, 행운템 쇼핑까지 제공하는 **PWA 기반 웹 서비스**.

### 타깃 사용자
- 로또 6/45 구매자 (주 1회 이상)
- 검색으로 "로또 당첨번호 / 세금 / 명당"을 찾는 사용자
- 당첨 시 자산 분배를 미리 시뮬레이션하고 싶은 사용자

### 핵심 가치 5가지
1. **Fast Check** — 당첨번호 즉시 확인 + 내 번호 매칭
2. **Real Money** — 세후 실수령액 정확 계산
3. **Dream Plan** — 당첨금 사용 계획 시뮬레이터
4. **Smart Stats** — 출현 빈도·패턴 분석
5. **Lucky Spots** — 1등 명당 + 행운템 큐레이션

---

## §1. 데이터 (사실관계)

### §1.1 로또 6/45 기본 정보 (2026년 5월 기준)
- 추첨일: 매주 토요일 20:40 KST (MBC 방송)
- API 반영: 약 21:00 KST 이후
- 1등 평균 당첨금: 약 18~20억원 (2026년 5월 기준)
- 1등 확률: 1 / 8,145,060
- 수령 기한: 1년

### §1.2 세금 (2025~2026년 현행)
| 구간 | 세율 |
|---|---|
| 200만원 이하 | 0% (비과세) |
| 200만 초과 ~ 3억 이하 | 22% |
| 3억 초과분 | 33% |

- 복권 구입비 1,000원은 당첨금에서 차감 후 과세
- 10원 미만 절사

### §1.3 1등 수령 위치
NH농협은행 본점 (서울 중구), 신관 15층 복권사업팀
- 1·2등: 본점만 가능
- 3등: 농협은행 지점
- 4·5등: 판매점 또는 농협

### §1.4 동행복권 API (비공식)
```
GET https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo={회차}
```

**응답 필드:**
- `drwNo` (int), `drwNoDate` (YYYY-MM-DD)
- `drwtNo1` ~ `drwtNo6` (int, 당첨번호), `bnusNo` (int, 보너스)
- `firstWinamnt` (int, 1등 1인당 당첨금)
- `firstPrzwnerCo` (int, 1등 당첨자 수)
- `firstAccumamnt` (int, 이월금)
- `totSellamnt` (int, 총판매금액)
- `returnValue`: "success" | "fail"

**⚠️ 클라이언트 직접 호출 금지** — Cloudflare Workers 프록시 경유 필수 (§2.1 참조)

### §1.5 공공데이터포털 데이터셋 (판매점)
- `data.go.kr/data/15086355` — 기획재정부_온라인복권 판매점 주소
- `data.go.kr/data/15059963` — 재정경제부_1등 당첨 판매점 현황

API 키 발급 필요, 무료. 월 1회 동기화 cron 운영.

---

## §2. 핵심 기능 (8개)

### §2.1 당첨번호 자동 조회 & 푸시 알림

**동작:**
- 토요일 21:00 KST 이후 Cloudflare Workers cron이 동행복권 API 폴링
- 새 회차 발견 시 → Firestore 저장 → FCM 토픽 `lotto_new_draw` 발송
- 실패 시 5분 후 재시도, 최대 6회

**클라이언트:**
- Firestore에서 최신 회차 fetch (Workers 프록시 미경유)
- 토픽 구독: `lotto_new_draw` (사용자 동의 시)
- 백필: 최초 방문 시 최근 50회차 IndexedDB 캐싱

### §2.2 세금 계산기

**TypeScript 구현:**
```typescript
// lib/core/tax/calculator.ts

/**
 * 로또 6/45 세금 계산 (2025~2026년 기준)
 * - 200만원 이하: 비과세
 * - 200만 초과 ~ 3억 이하: 22%
 * - 3억 초과분: 33%
 * - 복권 구입비 1,000원 차감 후 과세
 * - 10원 미만 절사
 */
export function calcTax(prize: number): number {
  const base = prize - 1000;
  if (base <= 2_000_000) return 0;
  
  let tax: number;
  if (base <= 300_000_000) {
    tax = Math.floor((base * 22) / 100);
  } else {
    tax = Math.floor((300_000_000 * 22) / 100)
        + Math.floor(((base - 300_000_000) * 33) / 100);
  }
  return Math.floor(tax / 10) * 10;
}

export function afterTax(prize: number): number {
  return prize - calcTax(prize);
}
```

**필수 테스트 케이스 (모두 통과해야 함):**

| 입력 (원) | 세금 (원) | 실수령 (원) |
|---|---|---|
| 1,000,000 | 0 | 1,000,000 |
| 5,000,000 | 1,099,780 | 3,900,220 |
| 100,000,000 | 21,999,780 | 78,000,220 |
| 300,000,000 | 65,999,780 | 234,000,220 |
| 1,000,000,000 | 296,999,670 | 703,000,330 |
| 1,857,550,000 | 579,991,170 | 1,277,558,830 |

### §2.3 사용 계획 계산기 ⭐ (핵심 차별화)

**카테고리:**
| ID | 이름 | 타입 | 아이콘 |
|---|---|---|---|
| `housing` | 주거(집) | 단일 | 🏠 |
| `vehicle` | 이동(차) | 단일 | 🚗 |
| `wishlist` | 위시리스트 | **다중 무제한** | ✨ |
| `finance` | 금융투자 | 단일/세부 | 📈 |
| `realEstate` | 부동산투자 | 단일/세부 | 🏢 |
| `donation` | 기부/가족 | 단일 (옵션) | 💝 |
| `reserve` | 여유자금 | **자동 계산** | 💰 |

**데이터 모델 (TypeScript):**
```typescript
export type Category = 
  | 'housing' | 'vehicle' | 'wishlist' 
  | 'finance' | 'realEstate' | 'donation' | 'reserve';

export interface SpendingPlan {
  id: string;
  name: string;              // "플랜 A"
  totalAmount: number;       // 세후 당첨금 (원)
  items: SpendingItem[];
  createdAt: string;         // ISO 8601
  updatedAt: string;
}

export interface SpendingItem {
  id: string;
  category: Category;
  name: string;              // "한강뷰 아파트"
  amount: number;            // 원
  memo?: string;
  imagePath?: string;        // IndexedDB 저장
}
```

**파생 계산:**
```typescript
const spent = items.reduce((sum, i) => sum + i.amount, 0);
const remaining = totalAmount - spent;
const isOverBudget = remaining < 0;
```

**UI 규칙:**
- 최상단 헤더: `세후 총당첨금 / 사용액 / 남은 금액`
- 음수가 되면 빨간색 + 경고 메시지
- 위시리스트 + 버튼으로 무제한 추가
- 도넛 차트로 카테고리별 비율
- 시나리오 저장 (플랜 A/B/C) — 같은 사용자가 여러 시나리오 비교
- PDF/이미지 내보내기

**저장소:** IndexedDB (Dexie.js)만 사용. 절대 Firestore에 안 보냄.

### §2.4 통계 & 분석

**제공 통계 (10가지):**
1. 번호별 출현 빈도 (히트맵, 1~45)
2. 핫 번호 TOP 5 (최근 20회)
3. 콜드 번호 TOP 5 (최근 20회)
4. 보너스 번호 빈도
5. 홀짝 비율 분포
6. 저고 비율 (1-22 vs 23-45)
7. 당첨번호 합계 분포 (히스토그램)
8. 연속 번호 패턴
9. 회차별 1등 당첨금 추이 (라인 차트)
10. 짝꿍 번호 (자주 함께 나오는 번호)

**필터:** 전체 / 최근 100회 / 50회 / 20회

**⚠️ 필수 고지:** 모든 통계 페이지 상단에
> "과거 패턴은 미래 당첨 확률과 무관합니다. 모든 번호의 당첨 확률은 수학적으로 동일합니다."

**구현:**
- 최초 방문 시 1회차부터 전체 백필 (~60MB 미만)
- IndexedDB에 저장
- 통계는 클라이언트에서 계산 (오프라인 동작)

### §2.5 판매점 찾기

**데이터 소스:** 공공데이터포털 (§1.5)

**기능:**
- 내 위치 반경 1km/3km/5km 토글
- ⭐ 1등 배출 판매점 강조 + 배출 횟수 뱃지
- 지도 마커 클릭 → 상세 카드 (상호, 주소, 전화, 1등 횟수, 길찾기)
- 즐겨찾기, 이름·주소 검색
- 지역 필터 (시/도 → 시/군/구)

**지오코딩:**
- 공공데이터는 주소만, 좌표 없음
- Cloudflare Workers에서 Naver/Kakao 지오코딩 API로 일괄 변환 → Firestore 캐싱
- 월 1회 동기화 cron

**데이터 모델:**
```typescript
export interface Store {
  id: string;
  name: string;              // 상호
  roadAddress: string;
  jibunAddress: string;
  lat: number;
  lng: number;
  phone?: string;
  firstPrizeCount: number;   // 1등 배출 횟수
  firstPrizeDraws: number[]; // 1등 배출 회차 목록
}

// 파생
const isLuckyStore = (s: Store) => s.firstPrizeCount > 0;
```

### §2.6 번호 자동 생성 (4가지 모드) ⭐ NEW

**모드:**
1. **전체 자동** — 6개 모두 생성
2. **1개 고정 + 5개 생성** — 사용자가 1개 입력
3. **2개 고정 + 4개 생성**
4. **3개 고정 + 3개 생성**

**알고리즘 (TypeScript):**
```typescript
// lib/core/generator/lotto-generator.ts

export interface GenerateOptions {
  fixedNumbers?: number[];   // 0~5개
  useStatistics?: boolean;   // 통계 가중치 적용 여부
  count?: number;            // 한 번에 생성할 세트 수 (기본 5)
}

export function generateLottoNumbers(opts: GenerateOptions = {}): number[] {
  const { fixedNumbers = [], useStatistics = false } = opts;
  if (fixedNumbers.length > 5) throw new Error('고정 번호는 최대 5개');
  if (fixedNumbers.some(n => n < 1 || n > 45)) throw new Error('1~45 범위');
  if (new Set(fixedNumbers).size !== fixedNumbers.length) throw new Error('중복 X');

  for (let attempt = 0; attempt < 100; attempt++) {
    const candidates = [...fixedNumbers];
    const pool = Array.from({length: 45}, (_, i) => i + 1)
      .filter(n => !candidates.includes(n));
    
    shuffle(pool, useStatistics); // 통계 모드면 가중치
    candidates.push(...pool.slice(0, 6 - candidates.length));
    candidates.sort((a, b) => a - b);
    
    if (passesValidation(candidates)) return candidates;
  }
  // fallback (거의 발생 안 함)
  return candidates;
}

function passesValidation(nums: number[]): boolean {
  // 1. 홀짝 비율 (2:4 ~ 4:2)
  const odd = nums.filter(n => n % 2 === 1).length;
  if (odd <= 1 || odd >= 5) return false;
  
  // 2. 저고 비율 (2:4 ~ 4:2)
  const low = nums.filter(n => n <= 22).length;
  if (low <= 1 || low >= 5) return false;
  
  // 3. 합계 100~175
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum < 100 || sum > 175) return false;
  
  // 4. 연속 번호 최대 2개
  let maxConsec = 1, curr = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i-1] + 1) { curr++; maxConsec = Math.max(maxConsec, curr); }
    else curr = 1;
  }
  if (maxConsec > 2) return false;
  
  // 5. 끝수 합 14~40
  const endSum = nums.reduce((a, b) => a + (b % 10), 0);
  if (endSum < 14 || endSum > 40) return false;
  
  // 6. 같은 끝수 최대 2개
  const endCounts = new Map<number, number>();
  for (const n of nums) {
    endCounts.set(n % 10, (endCounts.get(n % 10) ?? 0) + 1);
  }
  if ([...endCounts.values()].some(c => c > 2)) return false;
  
  return true;
}
```

**UX:**
- 한 번에 5세트 생성 (사용자가 마음에 드는 거 선택)
- "다시 생성" 버튼 (광고 없이 즉시)
- 결과 페이지 광고: 5세트 중간 1개 + 하단 1개
- 내 번호로 저장 기능 (IndexedDB)

**⚠️ 필수 고지:**
> "본 번호는 통계 분석 기반 참고용이며, 당첨을 보장하지 않습니다. 모든 번호의 당첨 확률은 수학적으로 동일합니다."

### §2.7 내 번호 관리

**기능:**
- 구매한 번호 6개 저장 (수동 입력)
- 새 회차 발표 시 자동 매칭
- 등수별 결과 히스토리
- 매칭 결과 푸시 알림 (클라이언트 매칭 → 로컬 알림)

**저장소:** IndexedDB만. Firestore에 안 보냄. (프라이버시)

### §2.8 행운템 코너 ⭐ (쿠팡 파트너스 수익화)

**구조:**
```
/lucky-items                     # 메인
/lucky-items/feng-shui           # 풍수 인테리어
/lucky-items/charms              # 부적
/lucky-items/crystal             # 크리스탈
/lucky-items/zodiac/[year]       # 띠별 (12지신)
/lucky-items/this-week           # 이번 주 인기
```

**상품 데이터:** 수동 큐레이션 (Firestore 또는 JSON) + 쿠팡 파트너스 링크

**필수 고지 (모든 페이지):**
> "본 페이지는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다."
> "#광고" 라벨 명시

---

## §3. 화면 구조 (Information Architecture)

### §3.1 페이지 맵
```
/                                홈 (최신 회차)
/draw/[no]                       회차별 (1,200개 SSG)
/draw/latest                     최신 (canonical로 /draw/{n})

/calculator/tax                  세금 계산기 ⭐
/calculator/spending-plan        사용 계획 계산기 ⭐

/stats                           통계 메인
/stats/number/[n]                번호별 (45개)
/stats/hot-cold                  핫/콜드
/stats/pattern                   패턴

/stores                          판매점 메인
/stores/region/[sido]            시도별 (17개)
/stores/city/[sigungu]           시군구별 (~250개)
/stores/top-luck-spots           1등 명당 TOP 50

/generator                       번호 생성기 메인 ⭐
/generator/auto                  모드 1: 전체 자동
/generator/fix-1                 모드 2: 1개 고정
/generator/fix-2                 모드 3: 2개 고정
/generator/fix-3                 모드 4: 3개 고정

/lucky-items                     행운템 메인
/lucky-items/feng-shui
/lucky-items/charms
/lucky-items/crystal
/lucky-items/zodiac/[year]
/lucky-items/this-week

/my-numbers                      내 번호 (IndexedDB)
/settings                        설정 + 알림

/guide/tax                       세금 가이드 (long-form)
/guide/how-to-claim              수령 방법
/guide/after-winning             당첨 후 행동
/guide/winner-stories            후기 모음

/about
/contact
/privacy
/terms
/disclaimer
```

### §3.2 네비게이션
- 데스크탑: 상단 가로 메뉴
- 모바일: 하단 Bottom Navigation 5개 + 햄버거

**Bottom Nav:**
1. 홈
2. 계산기
3. 번호생성
4. 통계
5. 더보기 (메뉴)

---

## §4. 비기능 요구사항

### 성능
- 콜드 스타트 (FCP) < 1.5초
- LCP < 2.5초
- CLS < 0.1
- API 응답 < 1초 (캐시 < 100ms)
- 60fps 유지 (계산기 입력)

### 오프라인 (PWA)
- 전체 회차 데이터 + 계산기 + 통계 오프라인 동작
- 지도만 온라인 필요

### 보안 & 프라이버시
- 사용 계획, 내 번호 → IndexedDB만
- 선택적 클라우드 백업 (구현은 Phase 4)
- HTTPS 필수

### 접근성
- 한국어 우선 (i18n 준비만)
- 동적 폰트 크기
- ARIA 레이블

### 법적 고지 (전 페이지 푸터)
- "비공식 앱, 정보 제공 목적"
- "과도한 사행 행위는 일상생활에 지장을 줄 수 있습니다"
- 만 19세 이상 안내
- 통신판매업 신고번호 (수익 발생 시 등록)
- 쿠팡 파트너스 활동 고지 (해당 페이지)

---

## §5. 출시 후 운영

### KPI
- 색인 페이지 수 (Search Console)
- MAU (Google Analytics)
- 페이지별 노출/클릭 (Search Console)
- AdSense / 쿠팡 파트너스 수익
- Core Web Vitals 점수

### 콘텐츠 발행
- 매주 토요일 추첨 후 회차 페이지 자동 생성 + 수동 코멘트 1줄
- 주 1~2회 가이드/블로그형 콘텐츠 추가

# §2. 기술 스택 & 폴더 구조

---

## §1. 확정 스택

| 영역 | 기술 | 비고 |
|---|---|---|
| 프레임워크 | **Next.js 14 (App Router)** | SSG + ISR로 SEO 극대화 |
| 언어 | TypeScript (strict mode) | 모든 코드 |
| 스타일 | Tailwind CSS + shadcn/ui | Tailwind v3 |
| 상태관리 | Zustand | 가벼움, 보일러플레이트 적음 |
| 데이터 페칭 | TanStack Query (React Query v5) | 캐싱, 재시도 |
| 로컬 DB | Dexie.js (IndexedDB 래퍼) | 사용자 데이터 저장 |
| 차트 | Recharts | 통계 시각화 |
| 지도 | Naver Maps JavaScript API | 한국 정확도 |
| 폼 | React Hook Form + Zod | 검증 |
| 푸시 | Web Push API + FCM | iOS는 16.4+ 필요 |
| 호스팅 | **Vercel Hobby (무료)** | 자동 배포 |
| 백엔드 (API) | **Cloudflare Workers (무료)** | 동행복권 프록시, cron |
| 데이터베이스 (서버) | **Firebase Firestore (Spark, 무료)** | 회차/판매점 |
| 분석 | Google Analytics 4 + Vercel Analytics | 무료 |
| 모니터링 | UptimeRobot | 다운타임 알림 |
| 검색 등록 | Google Search Console + Naver 서치어드바이저 | 필수 |
| PWA | next-pwa | 매니페스트, 서비스워커 |
| 광고 | Google AdSense (출시 6주 후) | 승인 필요 |
| 제휴 | 쿠팡 파트너스 | 행운템 코너 |
| 이메일 | Resend 또는 EmailJS (무료 100통/일) | 알림용 (선택) |

### 의존성 (pubspec 같은 거)

```json
// package.json (핵심만)
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "shadcn 의존성",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.0.0",
    "dexie": "^4.0.0",
    "dexie-react-hooks": "^1.1.0",
    "recharts": "^2.12.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "firebase": "^10.10.0",
    "next-pwa": "^5.6.0",
    "next-sitemap": "^4.2.0",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.0.x",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",
    "vitest": "^1.4.0",
    "@testing-library/react": "^14.2.0"
  }
}
```

---

## §2. 폴더 구조

```
goldlotto/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx                # 루트 레이아웃 + 메타데이터
│   ├── page.tsx                  # 홈 (/)
│   ├── globals.css               # Tailwind 진입점
│   ├── manifest.ts               # PWA 매니페스트
│   ├── sitemap.ts                # 동적 사이트맵
│   ├── robots.ts                 # robots.txt
│   │
│   ├── draw/
│   │   ├── [no]/page.tsx         # 회차별 (SSG)
│   │   └── latest/page.tsx       # 최신 회차 리다이렉트
│   │
│   ├── calculator/
│   │   ├── tax/page.tsx          # 세금 계산기
│   │   └── spending-plan/page.tsx # 사용 계획 계산기
│   │
│   ├── stats/
│   │   ├── page.tsx              # 통계 메인
│   │   ├── number/[n]/page.tsx   # 번호별
│   │   ├── hot-cold/page.tsx
│   │   └── pattern/page.tsx
│   │
│   ├── stores/
│   │   ├── page.tsx              # 판매점 메인
│   │   ├── region/[sido]/page.tsx
│   │   ├── city/[sigungu]/page.tsx
│   │   └── top-luck-spots/page.tsx
│   │
│   ├── generator/
│   │   ├── page.tsx              # 모드 선택
│   │   ├── auto/page.tsx
│   │   ├── fix-1/page.tsx
│   │   ├── fix-2/page.tsx
│   │   └── fix-3/page.tsx
│   │
│   ├── lucky-items/
│   │   ├── page.tsx
│   │   ├── feng-shui/page.tsx
│   │   ├── charms/page.tsx
│   │   ├── crystal/page.tsx
│   │   ├── zodiac/[year]/page.tsx
│   │   └── this-week/page.tsx
│   │
│   ├── guide/
│   │   ├── tax/page.tsx
│   │   ├── how-to-claim/page.tsx
│   │   ├── after-winning/page.tsx
│   │   └── winner-stories/page.tsx
│   │
│   ├── my-numbers/page.tsx
│   ├── settings/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── disclaimer/page.tsx
│
├── components/                   # React 컴포넌트
│   ├── ui/                       # shadcn/ui 자동 생성
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── lotto/
│   │   ├── LottoBall.tsx         # 로또 볼 (색상 매핑)
│   │   ├── LottoBallSet.tsx      # 6+1 세트
│   │   ├── DrawCard.tsx          # 회차 카드
│   │   └── MyNumberCard.tsx
│   ├── calculator/
│   │   ├── TaxCalculator.tsx
│   │   ├── SpendingPlanForm.tsx
│   │   ├── CategoryRow.tsx
│   │   ├── WishlistItem.tsx
│   │   └── SpendingChart.tsx
│   ├── stats/
│   │   ├── FrequencyHeatmap.tsx
│   │   ├── HotColdNumbers.tsx
│   │   ├── PatternChart.tsx
│   │   └── ...
│   ├── stores/
│   │   ├── StoreMap.tsx
│   │   ├── StoreCard.tsx
│   │   └── StoreFilter.tsx
│   ├── generator/
│   │   ├── GeneratorModeCard.tsx
│   │   ├── NumberPicker.tsx
│   │   └── ResultSet.tsx
│   ├── lucky-items/
│   │   ├── ProductCard.tsx
│   │   └── CategoryGrid.tsx
│   ├── ads/
│   │   ├── AdSenseSlot.tsx       # 환경변수 분기
│   │   └── CoupangBanner.tsx
│   ├── seo/
│   │   ├── JsonLd.tsx
│   │   └── OpenGraph.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── BottomNav.tsx
│   │   └── LegalNotice.tsx       # 면책 고지
│   └── common/
│       ├── FormattedAmount.tsx   # 천 단위 콤마
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
│
├── lib/                          # 비즈니스 로직 (순수)
│   ├── core/
│   │   ├── tax/
│   │   │   ├── calculator.ts     # ⭐ 세금 계산 (순수 함수)
│   │   │   └── calculator.test.ts
│   │   ├── stats/
│   │   │   ├── calculator.ts     # 통계 계산
│   │   │   └── calculator.test.ts
│   │   ├── generator/
│   │   │   ├── lotto-generator.ts # ⭐ 번호 생성
│   │   │   └── lotto-generator.test.ts
│   │   ├── geo/
│   │   │   └── distance.ts       # haversine
│   │   └── format/
│   │       ├── currency.ts       # 화폐 포맷
│   │       └── date.ts
│   │
│   ├── repository/               # 인터페이스 + 구현
│   │   ├── lotto-repository.ts   # 회차 데이터
│   │   ├── store-repository.ts   # 판매점
│   │   └── user-data-repository.ts # IndexedDB
│   │
│   ├── api/                      # API 클라이언트
│   │   ├── lotto-api.ts          # Workers 프록시 호출
│   │   ├── firestore.ts
│   │   └── public-data.ts        # 공공데이터포털
│   │
│   ├── db/                       # IndexedDB (Dexie)
│   │   ├── schema.ts
│   │   └── client.ts
│   │
│   ├── store/                    # Zustand 스토어
│   │   ├── tax-store.ts
│   │   ├── plan-store.ts
│   │   ├── my-numbers-store.ts
│   │   └── settings-store.ts
│   │
│   ├── firebase/
│   │   ├── config.ts
│   │   └── fcm.ts
│   │
│   ├── seo/
│   │   ├── metadata.ts           # generateMetadata 헬퍼
│   │   └── structured-data.ts    # JSON-LD 생성
│   │
│   └── utils/
│       ├── cn.ts                 # className 병합
│       ├── env.ts                # 환경변수 검증
│       └── constants.ts
│
├── public/
│   ├── icons/                    # PWA 아이콘들
│   ├── images/
│   ├── og/                       # OG 이미지
│   ├── favicon.ico
│   └── ...
│
├── workers/                      # Cloudflare Workers (별도 배포)
│   ├── lotto-cron.ts             # 토요일 21:00 cron
│   ├── lotto-proxy.ts            # 동행복권 프록시 (필요시)
│   ├── geocoding.ts              # 판매점 지오코딩
│   └── wrangler.toml             # CF 설정
│
├── scripts/                      # 빌드/운영 스크립트
│   ├── backfill-draws.ts         # 1회차부터 백필
│   ├── sync-stores.ts            # 공공데이터 동기화
│   └── generate-og.ts            # OG 이미지 생성
│
├── content/                      # 콘텐츠 파일 (Markdown)
│   ├── guides/
│   │   ├── tax.md
│   │   ├── how-to-claim.md
│   │   ├── after-winning.md
│   │   └── winner-stories/
│   └── lucky-items/
│       ├── feng-shui.md
│       ├── charms.md
│       └── ...
│
├── tests/                        # E2E 테스트 (선택)
│   └── ...
│
├── .env.example                  # 환경변수 템플릿
├── .env.local                    # 실제 환경변수 (gitignore)
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── next.config.mjs
├── next-sitemap.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## §3. 환경변수 (.env.example)

```bash
# === 사이트 ===
NEXT_PUBLIC_SITE_URL=https://[DOMAIN]
NEXT_PUBLIC_SITE_NAME=황금로또

# === Firebase ===
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
FIREBASE_ADMIN_PRIVATE_KEY=         # Workers/SSR용
FIREBASE_ADMIN_CLIENT_EMAIL=

# === Naver Maps ===
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=
NAVER_MAP_CLIENT_SECRET=

# === 공공데이터포털 ===
PUBLIC_DATA_API_KEY=

# === Cloudflare Workers ===
LOTTO_PROXY_URL=https://lotto.[DOMAIN].workers.dev

# === 광고 (출시 6주 후 입력) ===
NEXT_PUBLIC_ADSENSE_CLIENT_ID=      # 비어있으면 광고 영역 자체 숨김
NEXT_PUBLIC_COUPANG_PARTNERS_ID=

# === 분석 ===
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_NAVER_VERIFY=           # 네이버 사이트 소유 확인
NEXT_PUBLIC_GOOGLE_VERIFY=          # Google Search Console

# === 개발 ===
NODE_ENV=development
```

---

## §4. 절대 규칙

### 4.1 금액 처리
- **모든 화폐 단위 `number` (정수, 원)**
- `BigInt`, `Decimal.js` 사용 X (오버스펙)
- `parseFloat` 절대 X
- 입력 받을 때 `parseInt(str.replace(/,/g, ''), 10)` 패턴

### 4.2 동행복권 API
- 클라이언트 직접 호출 절대 X
- `lib/api/lotto-api.ts` → Cloudflare Workers 경유 → 동행복권
- User-Agent 헤더 필수 (Workers에서 설정)

### 4.3 사용자 데이터
- 내 번호, 사용 계획 → `IndexedDB(Dexie)`만
- Firestore에 사용자 식별 데이터 절대 저장 X
- 푸시 알림용 FCM 토큰만 익명으로 Firestore에 저장 가능

### 4.4 SEO
- 모든 페이지에 `generateMetadata()` 필수
- 회차/가이드 페이지에 JSON-LD 구조화 데이터 필수
- 이미지 `alt` 텍스트 필수
- 페이지마다 `canonical` URL 설정

### 4.5 광고
- AdSense 코드는 환경변수 `NEXT_PUBLIC_ADSENSE_CLIENT_ID` 분기
- 비어있으면 `<AdSenseSlot>` 컴포넌트가 `null` 반환
- 광고 위치는 §06_MONETIZATION.md의 규칙 엄수

### 4.6 테스트
- `lib/core/` 모든 순수 함수 → 단위 테스트 100% 커버
- 특히 `tax/calculator.ts`, `generator/lotto-generator.ts`

### 4.7 커밋 메시지
```
feat(§2.3): add wishlist multi-add
fix(§2.2): correct 10원 절사 로직
docs: update PRD §2.6
chore: bump deps
```

§번호는 `01_PRD.md`의 섹션 번호.

# §3. W1 셋업 작업

> **목표**: 1주일 내에 셋업 완료 → 세금 계산기 작동 + 배포 + 기본 SEO + CI

---

## 🚀 Cursor에게 줄 첫 프롬프트 (복사해서 그대로 붙여넣기)

```
나는 황금로또 PWA 프로젝트를 시작한다.
이 폴더의 cursor-brief/ 안 모든 .md 파일이 SSOT다.
모두 읽고 컨텍스트로 가지고 있어줘.

이제 03_W1_SETUP.md의 작업을 W1.1부터 순서대로 진행한다.
한 단계 끝날 때마다 결과 보여주고 확인 받은 후 다음으로 진행해줘.

W1.1: Next.js 14 프로젝트 생성부터 시작.
```

---

## §W1.1 프로젝트 생성

### 작업
```bash
# 프로젝트 생성
npx create-next-app@latest goldlotto \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --eslint

cd goldlotto

# Git 초기화
git init
git add .
git commit -m "chore: initial Next.js setup"
```

### 산출물
- `goldlotto/` 폴더 생성
- `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts` 기본 설정
- 첫 commit

### 검증
- `npm run dev` → `http://localhost:3000` 정상 동작
- `npm run build` 성공
- TypeScript strict 모드 확인 (`tsconfig.json`의 `"strict": true`)

---

## §W1.2 의존성 설치

### 작업
```bash
# 상태관리 + 데이터
npm i zustand @tanstack/react-query
npm i dexie dexie-react-hooks

# 폼 + 검증
npm i react-hook-form zod @hookform/resolvers

# 차트 + 아이콘
npm i recharts lucide-react

# 유틸
npm i date-fns clsx tailwind-merge

# Firebase
npm i firebase

# PWA + SEO
npm i next-pwa
npm i -D next-sitemap

# shadcn/ui 초기화
npx shadcn-ui@latest init

# 테스트
npm i -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom

# Prettier
npm i -D prettier prettier-plugin-tailwindcss
```

### 산출물
- `package.json`에 모든 의존성 추가
- `components.json` (shadcn/ui 설정)
- `.prettierrc` 생성:
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 검증
- `npm i` 무에러
- `npm run build` 무에러

---

## §W1.3 폴더 구조 생성

### 작업
`02_TECH_STACK.md` §2의 폴더 구조를 그대로 생성. 각 폴더에 `.gitkeep` 파일 또는 더미 `index.ts` 추가.

```bash
mkdir -p app/{draw/'[no]',calculator/{tax,spending-plan},stats/{number/'[n]',hot-cold,pattern},stores/{region/'[sido]',city/'[sigungu]',top-luck-spots},generator/{auto,fix-1,fix-2,fix-3},lucky-items/{feng-shui,charms,crystal,zodiac/'[year]',this-week},guide/{tax,how-to-claim,after-winning,winner-stories},my-numbers,settings,about,contact,privacy,terms,disclaimer}

mkdir -p components/{ui,lotto,calculator,stats,stores,generator,lucky-items,ads,seo,layout,common}

mkdir -p lib/{core/{tax,stats,generator,geo,format},repository,api,db,store,firebase,seo,utils}

mkdir -p public/{icons,images,og}
mkdir -p workers scripts content/{guides,lucky-items}
mkdir -p tests
```

### 산출물
- 전체 폴더 구조 생성 완료

---

## §W1.4 환경변수 설정

### 작업

`.env.example` 생성 (02_TECH_STACK.md §3 그대로):

```bash
# === 사이트 ===
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=황금로또

# === Firebase ===
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# === Naver Maps (W8에서 입력) ===
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=
NAVER_MAP_CLIENT_SECRET=

# === Cloudflare Workers (W2에서 입력) ===
LOTTO_PROXY_URL=

# === 광고 (출시 6주 후 입력) ===
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_COUPANG_PARTNERS_ID=

# === 분석 ===
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_NAVER_VERIFY=
NEXT_PUBLIC_GOOGLE_VERIFY=

# === 개발 ===
NODE_ENV=development
```

`.env.local` 생성 (gitignore 됨, 처음엔 빈 값 OK).

`lib/utils/env.ts` 작성:
```typescript
// 환경변수 타입 안전 접근
export const env = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? '황금로또',
  ADSENSE_CLIENT_ID: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? '',
  COUPANG_PARTNERS_ID: process.env.NEXT_PUBLIC_COUPANG_PARTNERS_ID ?? '',
  GA_ID: process.env.NEXT_PUBLIC_GA_ID ?? '',
  NAVER_VERIFY: process.env.NEXT_PUBLIC_NAVER_VERIFY ?? '',
  GOOGLE_VERIFY: process.env.NEXT_PUBLIC_GOOGLE_VERIFY ?? '',
} as const;
```

### 산출물
- `.env.example`, `.env.local`, `lib/utils/env.ts`

---

## §W1.5 ⭐ 세금 계산기 구현 + 테스트 (가장 중요)

### 작업

**`lib/core/tax/calculator.ts`** 작성:

```typescript
/**
 * 로또 6/45 세금 계산 (2025~2026년 기준)
 * 
 * 세율:
 * - 200만원 이하: 0% (비과세)
 * - 200만 초과 ~ 3억 이하: 22% (소득세 20% + 지방세 2%)
 * - 3억 초과분: 33% (소득세 30% + 지방세 3%)
 * 
 * 규칙:
 * - 복권 구입비 1,000원은 당첨금에서 차감 후 과세
 * - 10원 미만 절사
 */
export function calcTax(prize: number): number {
  if (prize < 0) throw new Error('당첨금은 0 이상이어야 합니다');
  if (!Number.isInteger(prize)) throw new Error('당첨금은 정수여야 합니다');
  
  const base = prize - 1000;
  if (base <= 2_000_000) return 0;
  
  let tax: number;
  if (base <= 300_000_000) {
    tax = Math.floor((base * 22) / 100);
  } else {
    tax = Math.floor((300_000_000 * 22) / 100)
        + Math.floor(((base - 300_000_000) * 33) / 100);
  }
  return Math.floor(tax / 10) * 10;
}

export function afterTax(prize: number): number {
  return prize - calcTax(prize);
}

/**
 * 등수별 평균 당첨금 (2026년 5월 기준 참고값)
 */
export const PRIZE_PRESETS = {
  rank5: 5_000,
  rank4: 50_000,
  rank3: 1_500_000,
  rank2: 50_000_000,
  rank1Average: 1_800_000_000,   // 2026년 평균
  rank1High: 2_500_000_000,      // 이월 회차
} as const;
```

### 테스트 ⭐ (이거 통과 못 하면 다음 단계 X)

**`lib/core/tax/calculator.test.ts`** 작성:

```typescript
import { describe, it, expect } from 'vitest';
import { calcTax, afterTax } from './calculator';

describe('calcTax', () => {
  // 비과세 구간
  it('200만원 이하는 비과세', () => {
    expect(calcTax(50_000)).toBe(0);
    expect(calcTax(1_000_000)).toBe(0);
    expect(calcTax(2_000_000)).toBe(0);
    expect(calcTax(2_001_000)).toBe(0); // 1,000원 차감 후 200만이라 비과세
  });

  it('22% 구간 정확 계산', () => {
    // 5,000,000 - 1,000 = 4,999,000
    // 4,999,000 * 0.22 = 1,099,780 (절사 X, 이미 10원 단위)
    expect(calcTax(5_000_000)).toBe(1_099_780);
    
    // 100,000,000 - 1,000 = 99,999,000
    // 99,999,000 * 0.22 = 21,999,780
    expect(calcTax(100_000_000)).toBe(21_999_780);
  });

  it('3억원 경계 처리', () => {
    // 300,000,000 - 1,000 = 299,999,000 (≤ 3억)
    // 299,999,000 * 0.22 = 65,999,780
    expect(calcTax(300_000_000)).toBe(65_999_780);
  });

  it('3억 초과 누진 계산', () => {
    // 1,000,000,000 → base 999,999,000
    // 22% 구간: 300,000,000 * 0.22 = 66,000,000
    // 33% 구간: 699,999,000 * 0.33 = 230,999,670
    // 합계: 296,999,670
    expect(calcTax(1_000_000_000)).toBe(296_999_670);
  });

  it('1222회 1등 (12억) 정확 계산', () => {
    // 12억 정확 가정
    // base = 1,199,999,000
    // 22%: 66,000,000
    // 33%: 899,999,000 * 0.33 = 296,999,670
    // 합계: 362,999,670
    expect(calcTax(1_200_000_000)).toBe(362_999_670);
  });

  it('1223회 1등 (18.5755억) 정확 계산', () => {
    // base = 1,857,549,000
    // 22%: 66,000,000
    // 33%: 1,557,549,000 * 0.33 = 513,991,170
    // 합계: 579,991,170
    expect(calcTax(1_857_550_000)).toBe(579_991_170);
  });

  it('30억 당첨', () => {
    // base = 2,999,999,000
    // 22%: 66,000,000
    // 33%: 2,699,999,000 * 0.33 = 890,999,670
    expect(calcTax(3_000_000_000)).toBe(956_999_670);
  });

  // 예외
  it('음수 입력 거부', () => {
    expect(() => calcTax(-1)).toThrow();
  });

  it('소수 입력 거부', () => {
    expect(() => calcTax(1.5)).toThrow();
  });
});

describe('afterTax', () => {
  it('실수령액 = 당첨금 - 세금', () => {
    expect(afterTax(5_000_000)).toBe(3_900_220);
    expect(afterTax(100_000_000)).toBe(78_000_220);
    expect(afterTax(1_000_000_000)).toBe(703_000_330);
    expect(afterTax(1_857_550_000)).toBe(1_277_558_830);
  });
});
```

**`vitest.config.ts`** 생성:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

`package.json` scripts에 추가:
```json
"test": "vitest run",
"test:watch": "vitest"
```

### 검증
- `npm test` 실행 → 모든 테스트 통과 (총 9개 이상)
- 하나라도 실패하면 다음 단계 진행 X

---

## §W1.6 화폐 포맷 유틸

### 작업

**`lib/core/format/currency.ts`**:
```typescript
/**
 * 원 단위 정수를 한국 화폐 포맷으로
 * @example formatKRW(1_234_567) → "1,234,567원"
 */
export function formatKRW(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/**
 * 큰 금액을 한국식 단위로 표시
 * @example formatKoreanAmount(1_200_000_000) → "12억원"
 * @example formatKoreanAmount(78_000_220) → "7,800만 220원"
 */
export function formatKoreanAmount(amount: number): string {
  if (amount < 10000) return `${amount.toLocaleString()}원`;
  
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);
  const won = amount % 10_000;
  
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok}억`);
  if (man > 0) parts.push(`${man.toLocaleString()}만`);
  if (won > 0) parts.push(`${won.toLocaleString()}`);
  
  return parts.join(' ') + '원';
}

/**
 * 입력 문자열을 정수로 (콤마 제거)
 */
export function parseKRW(input: string): number {
  const cleaned = input.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}
```

테스트도 작성. 통과 필수.

---

## §W1.7 기본 레이아웃 + 메타데이터

### 작업

**`app/layout.tsx`**:
```typescript
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { env } from '@/lib/utils/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: '황금로또 | 로또 6/45 당첨번호 + 세금계산기 + 사용계획',
    template: '%s | 황금로또',
  },
  description: '이번 주 로또 6/45 당첨번호 즉시 확인. 세전·세후 당첨금 계산, 19억 당첨 시 실수령액, 사용 계획 시뮬레이터까지 한 번에.',
  keywords: ['로또', '로또 6/45', '로또 당첨번호', '로또 세금 계산기', '당첨금 계산', '사용 계획', '명당', '번호 생성기'],
  authors: [{ name: '황금로또' }],
  creator: '황금로또',
  publisher: '황금로또',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: env.SITE_URL,
    title: '황금로또 | 로또 6/45 당첨번호 + 세금계산기',
    description: '당첨번호 확인부터 세후 실수령액, 사용 계획까지',
    siteName: '황금로또',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '황금로또',
    description: '로또 6/45 당첨번호 + 세금계산기',
    images: ['/og/default.png'],
  },
  verification: {
    google: env.GOOGLE_VERIFY || undefined,
    other: env.NAVER_VERIFY ? { 'naver-site-verification': env.NAVER_VERIFY } : undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: env.SITE_URL,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFD700', // 황금색
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background text-foreground">
        {children}
        {/* Footer는 컴포넌트로 추가 예정 */}
      </body>
    </html>
  );
}
```

**`app/page.tsx`** (홈, 임시):
```typescript
export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">황금로또</h1>
      <p className="mt-4 text-muted-foreground">
        로또 6/45 당첨번호, 세금계산기, 사용계획 시뮬레이터
      </p>
      {/* W2에서 본격 구현 */}
    </main>
  );
}
```

---

## §W1.8 세금 계산기 UI (간단 버전)

### 작업

**`app/calculator/tax/page.tsx`**:
```typescript
import type { Metadata } from 'next';
import { TaxCalculator } from '@/components/calculator/TaxCalculator';

export const metadata: Metadata = {
  title: '로또 당첨금 세금 계산기 | 19억 당첨 시 실수령액',
  description: '로또 1등 당첨금에서 세금을 뺀 실수령액을 계산. 200만원 비과세, 3억 초과 33% 적용. 2026년 5월 기준.',
  keywords: ['로또 세금 계산기', '당첨금 세금', '로또 실수령액', '복권 세금'],
  alternates: { canonical: '/calculator/tax' },
};

export default function TaxCalculatorPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold">로또 세금 계산기</h1>
      <p className="mt-2 text-muted-foreground">
        당첨금을 입력하면 세후 실수령액이 즉시 계산됩니다.
      </p>
      <TaxCalculator />
    </main>
  );
}
```

**`components/calculator/TaxCalculator.tsx`**:
```typescript
'use client';

import { useState } from 'react';
import { calcTax, afterTax } from '@/lib/core/tax/calculator';
import { formatKRW, formatKoreanAmount, parseKRW } from '@/lib/core/format/currency';

const PRESETS = [
  { label: '5등 (5천원)', value: 5_000 },
  { label: '4등 (5만원)', value: 50_000 },
  { label: '3등 (150만)', value: 1_500_000 },
  { label: '2등 (5천만)', value: 50_000_000 },
  { label: '1등 평균 (18억)', value: 1_800_000_000 },
  { label: '1등 이월 (25억)', value: 2_500_000_000 },
];

export function TaxCalculator() {
  const [input, setInput] = useState('');
  const prize = parseKRW(input);
  const tax = calcTax(prize);
  const net = afterTax(prize);

  return (
    <div className="mt-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">당첨금 (원)</label>
        <input
          type="text"
          inputMode="numeric"
          value={prize ? prize.toLocaleString() : ''}
          onChange={(e) => setInput(e.target.value)}
          placeholder="예: 1,800,000,000"
          className="w-full rounded-md border px-4 py-3 text-lg"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setInput(p.value.toString())}
            className="rounded-full border px-3 py-1 text-sm hover:bg-accent"
          >
            {p.label}
          </button>
        ))}
      </div>

      {prize > 0 && (
        <div className="rounded-lg border bg-card p-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">당첨금 (세전)</span>
            <span className="font-medium">{formatKRW(prize)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>세금</span>
            <span className="font-medium">- {formatKRW(tax)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between text-lg">
            <span className="font-bold">실수령액 (세후)</span>
            <span className="font-bold text-primary">{formatKRW(net)}</span>
          </div>
          <div className="text-sm text-muted-foreground text-center pt-2">
            약 <strong>{formatKoreanAmount(net)}</strong>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        ※ 200만원 이하 비과세, 3억 이하 22%, 3억 초과 33% 적용 (2025~2026년 기준).
        실제 수령액은 세무 처리에 따라 차이가 있을 수 있습니다.
      </div>
    </div>
  );
}
```

### 검증
- `http://localhost:3000/calculator/tax` 접속
- 1,800,000,000 입력 → "실수령액: 1,239,000,330원, 약 12억 3,900만 330원" 표시
- 프리셋 버튼 클릭 시 자동 입력

---

## §W1.9 Vercel 배포

### 작업

1. **Vercel 가입 + GitHub 연동**
2. GitHub에 저장소 push
3. Vercel에서 "Import Project" → 저장소 선택
4. 환경변수는 일단 비워두고 Deploy
5. 배포된 URL 확인

### 산출물
- `https://goldlotto-xxx.vercel.app` 배포 완료
- 홈 + 세금 계산기 작동 확인

---

## §W1.10 GitHub Actions CI

### 작업

**`.github/workflows/ci.yml`**:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

### 검증
- push 후 GitHub Actions 탭에서 녹색 체크 확인

---

## §W1.11 모니터링 셋업 (트래픽 알림)

### 작업

1. **Vercel Analytics 활성화**
   - Vercel Dashboard → Project → Analytics → Enable

2. **UptimeRobot 가입 (무료)**
   - `uptimerobot.com` 가입
   - 새 모니터 추가 → HTTP(s) → 배포된 URL
   - 알림 이메일 설정

3. **Google Analytics 4 (도메인 확정 후)**
   - Phase 2로 미룸. 도메인 정해지면 G-XXXXXXX 발급 → `.env.local`에 입력

---

## ✅ W1 완료 체크리스트

- [ ] §W1.1 Next.js 프로젝트 생성, 첫 commit
- [ ] §W1.2 모든 의존성 설치 완료
- [ ] §W1.3 폴더 구조 완성
- [ ] §W1.4 환경변수 템플릿 + `env.ts`
- [ ] §W1.5 **세금 계산기 테스트 9개 이상 통과** ⭐
- [ ] §W1.6 화폐 포맷 유틸 + 테스트
- [ ] §W1.7 기본 레이아웃 + 메타데이터
- [ ] §W1.8 세금 계산기 페이지 + UI 작동
- [ ] §W1.9 Vercel 배포 완료
- [ ] §W1.10 GitHub Actions CI 녹색
- [ ] §W1.11 UptimeRobot 모니터링

**모두 완료 시 W2로 진행 → `04_MILESTONES.md` 참조**

# §4. W2~W9 마일스톤

> W1은 별도 (`03_W1_SETUP.md`). W2부터 여기서.
> 각 주차마다 산출물 + 검증 기준 명시.

---

## W2: 동행복권 API 연동 + 홈 화면

### 목표
- Cloudflare Workers 프록시 구축
- 회차 데이터 Firestore 저장
- 홈에서 최신 회차 표시

### W2.1 Firebase 프로젝트 셋업
1. Firebase Console → 새 프로젝트 (이름: goldlotto)
2. Firestore Database 생성 (asia-northeast3 = 서울 리전)
3. FCM 활성화 (Web Push)
4. 웹 앱 등록 → 설정 키들을 `.env.local`에 입력

### W2.2 Cloudflare Workers cron 작성

`workers/lotto-cron.ts`:
```typescript
export default {
  async scheduled(event: ScheduledEvent, env: Env) {
    // 토요일 21:00 KST = UTC 12:00
    // 동행복권 API에서 새 회차 폴링
    // 새 회차 발견 시:
    //  1. Firestore에 저장
    //  2. FCM 토픽 'lotto_new_draw' 발송
  },
  
  async fetch(request: Request, env: Env): Promise<Response> {
    // 클라이언트 프록시 (회차 조회 요청)
    const url = new URL(request.url);
    const drwNo = url.searchParams.get('drwNo');
    
    // 캐시 키 생성
    const cacheKey = `lotto:${drwNo}`;
    const cached = await env.LOTTO_KV.get(cacheKey);
    if (cached) return new Response(cached, { headers: corsHeaders });
    
    // 동행복권 호출
    const res = await fetch(
      `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Goldlotto/1.0)' } }
    );
    const data = await res.text();
    
    // 24시간 캐싱
    await env.LOTTO_KV.put(cacheKey, data, { expirationTtl: 86400 });
    return new Response(data, { headers: corsHeaders });
  },
};
```

`wrangler.toml`:
```toml
name = "goldlotto-api"
main = "workers/lotto-cron.ts"
compatibility_date = "2026-01-01"

[triggers]
crons = ["*/5 12-15 * * 6"]  # 토요일 21:00~24:00 KST, 5분 간격

kv_namespaces = [
  { binding = "LOTTO_KV", id = "..." }
]
```

배포: `wrangler deploy`

### W2.3 LottoRepository 구현

`lib/repository/lotto-repository.ts`:
```typescript
export interface LottoDraw {
  drwNo: number;
  drwNoDate: string;  // YYYY-MM-DD
  numbers: [number, number, number, number, number, number];
  bonus: number;
  firstWinamnt: number;
  firstPrzwnerCo: number;
  firstAccumamnt: number;
  totSellamnt: number;
}

export interface LottoRepository {
  getLatest(): Promise<LottoDraw>;
  getByNo(no: number): Promise<LottoDraw | null>;
  getRange(from: number, to: number): Promise<LottoDraw[]>;
}

// 구현: lib/repository/firestore-lotto-repository.ts
// 구현: lib/repository/cached-lotto-repository.ts (IndexedDB 캐시)
```

### W2.4 홈 화면 구현

`app/page.tsx`:
- 최신 회차 카드 (LottoBallSet)
- 1등 당첨금 + 당첨자 수
- 다음 추첨까지 D-day 카운트다운
- 빠른 링크 (계산기, 통계, 생성기)
- 최근 5회차 미리보기

`components/lotto/LottoBall.tsx`:
```typescript
const BALL_COLORS = {
  1: '#fbc400',   // 노란색 (1-10)
  10: '#69c8f2',  // 파란색 (11-20)
  20: '#ff7272',  // 빨간색 (21-30)
  30: '#aaa',     // 회색 (31-40)
  40: '#b0d840',  // 초록색 (41-45)
};

export function LottoBall({ num }: { num: number }) {
  const color = num <= 10 ? BALL_COLORS[1]
              : num <= 20 ? BALL_COLORS[10]
              : num <= 30 ? BALL_COLORS[20]
              : num <= 40 ? BALL_COLORS[30]
              : BALL_COLORS[40];
  
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full text-white font-bold"
      style={{ backgroundColor: color }}
    >
      {num}
    </div>
  );
}
```

### W2 검증
- [ ] Workers cron 배포 완료
- [ ] Firestore에 최근 50회차 저장됨
- [ ] 홈에서 최신 회차 표시
- [ ] LottoBall 색상 정확

---

## W3: 사용 계획 계산기 ⭐ (가장 차별화)

### 목표
- 카테고리별 입력 → 실시간 남은 금액 계산
- 시나리오 저장 (IndexedDB)
- 도넛 차트

### W3.1 Dexie.js IndexedDB 셋업

`lib/db/schema.ts`:
```typescript
import Dexie, { Table } from 'dexie';
import type { SpendingPlan, MyTicket } from '@/lib/types';

export class GoldlottoDB extends Dexie {
  plans!: Table<SpendingPlan, string>;
  tickets!: Table<MyTicket, string>;

  constructor() {
    super('Goldlotto');
    this.version(1).stores({
      plans: 'id, name, createdAt, updatedAt',
      tickets: 'id, drwNo, createdAt',
    });
  }
}

export const db = new GoldlottoDB();
```

### W3.2 사용 계획 데이터 모델 + 스토어

`lib/store/plan-store.ts` (Zustand):
```typescript
import { create } from 'zustand';
import { db } from '@/lib/db/schema';
import type { SpendingPlan, SpendingItem } from '@/lib/types';

interface PlanStore {
  currentPlan: SpendingPlan | null;
  plans: SpendingPlan[];
  
  loadPlans: () => Promise<void>;
  createPlan: (totalAmount: number) => Promise<void>;
  setCurrentPlan: (planId: string) => Promise<void>;
  addItem: (item: Omit<SpendingItem, 'id'>) => Promise<void>;
  updateItem: (id: string, patch: Partial<SpendingItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  
  // 파생
  spent: () => number;
  remaining: () => number;
}
```

### W3.3 UI 구현

`app/calculator/spending-plan/page.tsx`:
- 헤더: 세후 총당첨금 / 사용액 / 남은 금액 (스티키)
- 카테고리 카드 6개 (주거/이동/위시리스트/금융/부동산/기부)
- 위시리스트는 + 버튼으로 무제한 추가
- 음수 시 빨간 경고
- 도넛 차트 (Recharts)
- 시나리오 저장/불러오기/삭제

`components/calculator/SpendingPlanForm.tsx` 등...

### W3 검증
- [ ] 총당첨금 1,300,000,000 입력
- [ ] 주거 700,000,000 / 이동 100,000,000 입력
- [ ] 남은 금액 500,000,000 정확 표시
- [ ] 위시리스트 5개 추가 가능
- [ ] 새로고침해도 유지 (IndexedDB)
- [ ] 시나리오 2개 저장 + 전환 가능

---

## W4: 번호 생성기 4모드 ⭐

### 목표
- §2.6의 4가지 모드 모두 구현
- 5세트 동시 생성
- 검증 규칙 100% 통과

### W4.1 핵심 알고리즘

`lib/core/generator/lotto-generator.ts` 작성 — 01_PRD.md §2.6 그대로.

### W4.2 ⭐ 알고리즘 테스트

`lib/core/generator/lotto-generator.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { generateLottoNumbers } from './lotto-generator';

describe('generateLottoNumbers', () => {
  it('전체 자동: 6개 생성', () => {
    const nums = generateLottoNumbers();
    expect(nums).toHaveLength(6);
    expect(new Set(nums).size).toBe(6); // 중복 X
    expect(nums.every(n => n >= 1 && n <= 45)).toBe(true);
    expect([...nums].sort((a, b) => a - b)).toEqual(nums); // 정렬됨
  });

  it('1개 고정', () => {
    const nums = generateLottoNumbers({ fixedNumbers: [7] });
    expect(nums).toContain(7);
    expect(nums).toHaveLength(6);
  });

  it('3개 고정', () => {
    const nums = generateLottoNumbers({ fixedNumbers: [1, 15, 30] });
    expect(nums).toContain(1);
    expect(nums).toContain(15);
    expect(nums).toContain(30);
  });

  it('검증 규칙 통과: 100번 생성해도 모두 통과', () => {
    for (let i = 0; i < 100; i++) {
      const nums = generateLottoNumbers();
      
      // 홀짝
      const odd = nums.filter(n => n % 2 === 1).length;
      expect(odd).toBeGreaterThanOrEqual(2);
      expect(odd).toBeLessThanOrEqual(4);
      
      // 저고
      const low = nums.filter(n => n <= 22).length;
      expect(low).toBeGreaterThanOrEqual(2);
      expect(low).toBeLessThanOrEqual(4);
      
      // 합계
      const sum = nums.reduce((a, b) => a + b, 0);
      expect(sum).toBeGreaterThanOrEqual(100);
      expect(sum).toBeLessThanOrEqual(175);
    }
  });

  it('잘못된 입력 거부', () => {
    expect(() => generateLottoNumbers({ fixedNumbers: [1, 2, 3, 4, 5, 6] })).toThrow();
    expect(() => generateLottoNumbers({ fixedNumbers: [0] })).toThrow();
    expect(() => generateLottoNumbers({ fixedNumbers: [46] })).toThrow();
    expect(() => generateLottoNumbers({ fixedNumbers: [1, 1, 2] })).toThrow(); // 중복
  });
});
```

### W4.3 UI 페이지 5개

`app/generator/page.tsx` — 모드 선택
`app/generator/auto/page.tsx`
`app/generator/fix-1/page.tsx`
`app/generator/fix-2/page.tsx`
`app/generator/fix-3/page.tsx`

각 페이지마다 메타데이터:
```typescript
export const metadata = {
  title: '무료 로또 번호 생성기 (자동) | 통계 검증 5세트',
  description: '...',
  alternates: { canonical: '/generator/auto' },
};
```

**⚠️ 필수 고지** 모든 결과 페이지에:
> "본 번호는 통계 분석 기반 참고용이며, 당첨을 보장하지 않습니다. 모든 번호의 당첨 확률은 수학적으로 동일합니다."

### W4 검증
- [ ] 4가지 모드 모두 작동
- [ ] 한 번에 5세트 생성
- [ ] 테스트 100번 반복해도 검증 규칙 통과
- [ ] 면책 고지 모든 페이지에 표시

---

## W5: 회차별 페이지 + SSG + SEO

### 목표
- 1회차부터 최신까지 회차별 페이지 (1,200+개)
- ISR로 새 회차 자동 추가
- JSON-LD 구조화 데이터

### W5.1 회차 백필

`scripts/backfill-draws.ts`:
```typescript
// 1회차부터 최신까지 동행복권 API 호출 → Firestore 저장
// 한 번만 실행 (또는 빈 곳만 채우기)
```

### W5.2 SSG 페이지

`app/draw/[no]/page.tsx`:
```typescript
export async function generateStaticParams() {
  // 1 ~ 최신회차까지 생성
  const latest = await getLatestDrawNo();
  return Array.from({length: latest}, (_, i) => ({ no: String(i + 1) }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const draw = await getDraw(Number(params.no));
  return {
    title: `로또 ${draw.drwNo}회 당첨번호 ${draw.numbers.join(',')}+${draw.bonus}`,
    description: `${draw.drwNoDate} 추첨 로또 ${draw.drwNo}회 1등 당첨번호. 1등 ${draw.firstPrzwnerCo}명, 1인당 ${formatKoreanAmount(draw.firstWinamnt)}.`,
    alternates: { canonical: `/draw/${draw.drwNo}` },
  };
}

export const revalidate = 86400; // 24시간마다 재생성
```

### W5.3 JSON-LD

`components/seo/JsonLd.tsx`:
```typescript
export function DrawJsonLd({ draw }: { draw: LottoDraw }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `로또 ${draw.drwNo}회 당첨번호`,
    datePublished: draw.drwNoDate,
    author: { '@type': 'Organization', name: '황금로또' },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

### W5.4 sitemap.xml + robots.txt

`app/sitemap.ts`:
```typescript
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const draws = await getAllDrawNos();
  return [
    { url: env.SITE_URL, priority: 1.0, changeFrequency: 'daily' },
    { url: `${env.SITE_URL}/calculator/tax`, priority: 0.9 },
    { url: `${env.SITE_URL}/calculator/spending-plan`, priority: 0.9 },
    { url: `${env.SITE_URL}/generator`, priority: 0.9 },
    // ... 각 페이지
    ...draws.map(no => ({
      url: `${env.SITE_URL}/draw/${no}`,
      priority: 0.6,
      changeFrequency: 'never' as const,
    })),
  ];
}
```

### W5 검증
- [ ] 1,200+ 회차 페이지 빌드 성공
- [ ] sitemap.xml 자동 생성
- [ ] Search Console에 사이트맵 제출
- [ ] 네이버 서치어드바이저 등록

---

## W6: 통계 페이지

### 목표
- 10가지 통계 시각화
- 클라이언트 계산 (오프라인)

### W6.1 StatsCalculator 순수 함수

`lib/core/stats/calculator.ts`:
```typescript
export function frequencyByNumber(draws: LottoDraw[]): Map<number, number> { ... }
export function hotNumbers(draws: LottoDraw[], top = 5): number[] { ... }
export function coldNumbers(draws: LottoDraw[], top = 5): number[] { ... }
export function oddEvenRatio(draws: LottoDraw[]): { odd: number; even: number }[] { ... }
export function lowHighRatio(draws: LottoDraw[]): ... { ... }
export function sumDistribution(draws: LottoDraw[]): ... { ... }
// ... 등
```

테스트 필수.

### W6.2 페이지들
- `/stats` 메인 (히트맵 + 핫/콜드)
- `/stats/number/[n]` (1~45번 각각)
- `/stats/hot-cold`
- `/stats/pattern`

### W6.3 필수 면책 고지
모든 통계 페이지 상단에:
> "과거 패턴은 미래 당첨 확률과 무관합니다. 모든 번호의 당첨 확률은 수학적으로 동일합니다."

### W6 검증
- [ ] 10가지 통계 모두 작동
- [ ] 필터 (전체/100/50/20회) 작동
- [ ] 차트 모바일 반응형

---

## W7: 판매점 찾기

### 목표
- 공공데이터포털 데이터 수입
- Naver Maps 통합
- 1등 명당 표시

### W7.1 데이터 수입

`scripts/sync-stores.ts`:
1. 공공데이터포털 API 키로 판매점 데이터 가져오기
2. 1등 당첨 판매점 데이터 가져오기
3. Naver/Kakao 지오코딩 API로 좌표 변환
4. Firestore에 저장

### W7.2 페이지

`/stores` — 지도 + 검색
`/stores/region/[sido]` — 시도별
`/stores/city/[sigungu]` — 시군구별
`/stores/top-luck-spots` — 1등 명당 TOP 50

### W7.3 광고 + 행운템 통합

판매점 카드 5개마다 광고 1개 + "이 명당 손님들이 자주 가지는 행운템" 추천 카드

### W7 검증
- [ ] 전국 판매점 데이터 Firestore 적재
- [ ] 지도에 마커 정상 표시
- [ ] 1등 명당 ⭐ 강조
- [ ] 길찾기 (Naver/Kakao 지도 앱) 연결

---

## W8: 가이드 콘텐츠 + 행운템 + 마지막 폴리시

### 목표
- 가이드 4개 발행 (세금/수령/당첨후/후기)
- 행운템 카테고리 5개 페이지
- 면책 페이지들 (About/Contact/Privacy/Terms/Disclaimer)
- PWA 매니페스트 + 서비스워커
- Lighthouse 90+ 점수

### W8.1 가이드 페이지

Markdown 파일을 MDX로 렌더링. `content/guides/` 폴더의 .md 읽어서 페이지로.

세금 가이드는 이전 대화에서 작성한 콘텐츠 사용 (3,500자+).

### W8.2 행운템 페이지

각 카테고리마다 상품 10~20개. 데이터는 일단 JSON 파일로 (수동 큐레이션):

`content/lucky-items/feng-shui.json`:
```json
[
  {
    "id": "fs-001",
    "name": "황금 두꺼비 부적",
    "price": 8900,
    "rating": 4.7,
    "imageUrl": "...",
    "coupangUrl": "https://link.coupang.com/...?lptag=AF000000",
    "description": "재물운 상징, 입에 동전을 물고 있어 부를 가져옴",
    "category": "feng-shui"
  },
  ...
]
```

**⚠️ 필수 고지** 모든 행운템 페이지:
> "본 페이지는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다."

### W8.3 법적 페이지

- `/about` — 사이트 소개
- `/contact` — 이메일 form 또는 정적 이메일
- `/privacy` — 개인정보처리방침
- `/terms` — 이용약관
- `/disclaimer` — 면책 조항 (필수)

### W8.4 PWA 매니페스트

`app/manifest.ts`:
```typescript
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '황금로또',
    short_name: '황금로또',
    description: '로또 6/45 당첨번호 + 세금계산기 + 사용계획',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FFD700',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
```

### W8.5 Lighthouse 점수

목표:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 100

### W8 검증
- [ ] 가이드 4개 발행
- [ ] 행운템 5개 카테고리 × 10~20 상품
- [ ] 법적 페이지 5개
- [ ] PWA 설치 가능 (Chrome → 홈 화면에 추가)
- [ ] Lighthouse 점수 목표 달성

---

## W9: 출시 + AdSense 신청 + 콘텐츠 발행 루틴

### W9.1 도메인 연결
- `[DOMAIN]` Vercel에 연결
- HTTPS 자동 발급 확인
- `.env`의 SITE_URL 업데이트

### W9.2 검색엔진 등록
1. Google Search Console:
   - 도메인 소유 확인 (DNS TXT)
   - 사이트맵 제출
   - 주요 페이지 URL 인덱싱 요청
2. Naver Search Advisor:
   - 사이트 등록
   - 사이트맵 제출
   - RSS 제출

### W9.3 분석 도구 연결
- Google Analytics 4 코드 삽입
- `NEXT_PUBLIC_GA_ID` 환경변수
- Vercel Analytics 활성화

### W9.4 모니터링 강화
- UptimeRobot 알림 확인
- Firebase 예산 알림 설정 (50%, 80%, 100%)
- Google Cloud Console 예산 ₩10,000/일 (안전망)

### W9.5 콘텐츠 발행 루틴 (출시 후 매주)
- 토요일 추첨 후 1시간 내: 회차 페이지 자동 생성 + 수동 코멘트 1줄 추가
- 주중 1~2회: 가이드 콘텐츠 추가
- 매주 일요일: Search Console 통계 확인

### W9 검증
- [ ] 도메인 연결 + HTTPS
- [ ] Google + Naver 검색 등록
- [ ] GA4 데이터 수집 시작
- [ ] 모니터링 알림 작동
- [ ] 첫 콘텐츠 1개 추가

---

## W10+ (출시 6주 후): AdSense 신청

### W10.1 신청 전 체크리스트
- [ ] About / Contact / Privacy / Terms / Disclaimer 페이지 ✓
- [ ] 콘텐츠 50개 이상 (회차 + 가이드 + 행운템)
- [ ] 도메인 + HTTPS ✓
- [ ] 사이트 운영 6주 이상 ✓
- [ ] Search Console 색인 페이지 200+ ✓

### W10.2 신청
1. `adsense.google.com` 가입
2. 사이트 추가 → `[DOMAIN]`
3. AdSense 코드를 `app/layout.tsx`에 삽입
4. 심사 대기 (며칠 ~ 2-4주)

### W10.3 승인 후
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` 환경변수에 입력
- `<AdSenseSlot>` 컴포넌트 활성화
- 06_MONETIZATION.md의 광고 배치 규칙 따라 적용

---

## 마일스톤 요약 차트

| 주차 | 핵심 산출물 | 리스크 |
|---|---|---|
| W1 | 셋업 + 세금 계산기 | 낮음 |
| W2 | API 연동 + 홈 | 동행복권 API 차단 |
| W3 | 사용 계획 계산기 ⭐ | 낮음 |
| W4 | 번호 생성기 ⭐ | 낮음 |
| W5 | 회차 페이지 1,200+ | SSG 빌드 시간 |
| W6 | 통계 페이지 | 백필 시간 |
| W7 | 판매점 + 지도 | 지오코딩 비용 |
| W8 | 가이드 + 행운템 + 폴리시 | 콘텐츠 작성 시간 |
| W9 | 출시 + SEO 등록 | 검색 등록 지연 |
| W10+ | AdSense 신청 | 승인 거절 |

# §5. SEO 구현 가이드

> SEO가 매출의 70%. 코딩보다 더 중요한 부분.

---

## §1. 전략 요약

**우리 무기:** 페이지 수량으로 압도 (1,200+ 회차 + 45번호 + 250시군구 + 가이드)
**대전략:** 빅 키워드 X → 롱테일 점유 + 차별화 콘텐츠

---

## §2. 타깃 키워드 (구현 우선순위)

### A 그룹: 우리만의 강점 (★★★)
| 키워드 | 페이지 | 검색량 |
|---|---|---|
| 로또 당첨금 계산기 | `/calculator/tax` | 월 20만+ |
| 로또 세금 계산기 | `/calculator/tax` | 월 15만+ |
| 로또 세후 실수령액 | `/calculator/tax` | 월 8만+ |
| 로또 1등 실수령 | `/calculator/tax` | 월 10만+ |

### B 그룹: 차별화 콘텐츠 (★★★)
| 키워드 | 페이지 | 검색량 |
|---|---|---|
| 로또 당첨되면 뭐하지 | `/calculator/spending-plan` | 월 5천~1만 |
| 로또 당첨금 수령 방법 | `/guide/how-to-claim` | 월 2만+ |
| 로또 당첨 후 | `/guide/after-winning` | 월 3만+ |
| 로또 당첨자 후기 | `/guide/winner-stories` | 월 3만+ |

### C 그룹: 행운템 (★★★ — 쿠팡 수익 직결)
| 키워드 | 페이지 | 검색량 |
|---|---|---|
| 행운의 부적 | `/lucky-items/charms` | 월 1~3만 |
| 풍수 인테리어 | `/lucky-items/feng-shui` | 월 5천~1만 |
| 12지신 띠별 운세 2026 | `/lucky-items/zodiac/2026` | 월 1만+ |
| 로또 명당 | `/stores/top-luck-spots` | 월 2만+ |

### D 그룹: 롱테일 자동 (★★)
- 회차별: `로또 1223회 당첨번호` 등 (1,200+ 페이지)
- 번호별: `로또 27번 통계` 등 (45 페이지)
- 지역별: `강남구 로또 판매점` 등 (250+ 페이지)
- 띠별: `쥐띠 행운템 2026` 등 (12 페이지)

---

## §3. 페이지별 메타데이터 패턴

### 홈 (`/`)
```typescript
{
  title: '황금로또 | 로또 6/45 당첨번호 + 세금계산기 + 사용계획',
  description: '이번 주 당첨번호 즉시 확인. 세전·세후 당첨금 계산, 19억 당첨 시 실수령액, 사용 계획 시뮬레이터.',
  keywords: ['로또', '당첨번호', '세금 계산기', '실수령액'],
}
```

### 회차별 (`/draw/[no]`)
```typescript
async function generateMetadata({ params }) {
  const draw = await getDraw(params.no);
  return {
    title: `로또 ${draw.drwNo}회 당첨번호 ${draw.numbers.join(',')}+${draw.bonus}`,
    description: `${draw.drwNoDate} 추첨. 1등 ${draw.firstPrzwnerCo}명, 1인당 ${formatKoreanAmount(draw.firstWinamnt)}. 세후 실수령액 약 ${formatKoreanAmount(afterTax(draw.firstWinamnt))}.`,
    alternates: { canonical: `/draw/${draw.drwNo}` },
  };
}
```

### 세금 계산기 (`/calculator/tax`)
```typescript
{
  title: '로또 당첨금 세금 계산기 | 19억 당첨 시 실수령액',
  description: '로또 1등 당첨금에서 세금을 뺀 실수령액을 계산. 200만원 비과세, 3억 초과 33% 적용. 즉시 결과.',
  keywords: ['로또 세금 계산기', '당첨금 세금', '로또 실수령액'],
}
```

### 번호 생성기 (`/generator/auto`)
```typescript
{
  title: '무료 로또 번호 생성기 | 통계 검증 5세트 자동 생성',
  description: '6개 번호를 통계 검증 규칙에 따라 자동 생성. 홀짝 비율, 합계, 연속 번호 등 6가지 규칙 통과한 조합만 추천.',
  keywords: ['로또 번호 생성기', '로또 자동 번호', '로또 번호 추천'],
}
```

### 가이드 글 (`/guide/tax`)
```typescript
{
  title: '로또 당첨금 세금 완벽 정리 2026 | 19억 당첨 시 실수령액',
  description: '로또 1등 당첨금에서 세금이 얼마 빠지는지 한눈에 정리. 200만원 비과세, 22%·33% 누진. 2026년 5월 기준.',
}
```

---

## §4. JSON-LD 구조화 데이터

### 회차 페이지
```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: `로또 ${draw.drwNo}회 당첨번호`,
  datePublished: draw.drwNoDate,
  dateModified: draw.drwNoDate,
  author: { '@type': 'Organization', name: '황금로또' },
  publisher: {
    '@type': 'Organization',
    name: '황금로또',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/logo.png` }
  },
  mainEntityOfPage: `${SITE_URL}/draw/${draw.drwNo}`,
}
```

### 가이드 (Article + FAQPage)
```typescript
// Article
{
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  datePublished, dateModified,
  author, publisher,
}

// FAQ 섹션이 있으면 추가
{
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a }
  }))
}
```

### 사이트 전체 (홈에)
```typescript
{
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '황금로또',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
}
```

---

## §5. 네이버 SEO 별도 작업

한국 검색 시장 50%+를 네이버가 차지. 구글과 별도 등록 필수.

### §5.1 네이버 서치어드바이저 등록
1. `searchadvisor.naver.com` 접속
2. 웹마스터 도구 → 사이트 등록 → 도메인 입력
3. 소유 확인:
   - HTML 메타 태그 방식 권장
   - `app/layout.tsx` → `metadata.verification.other` 에 추가
4. 사이트맵 제출: `https://[DOMAIN]/sitemap.xml`
5. RSS 제출: `https://[DOMAIN]/rss.xml`
6. robots.txt 수집 요청

### §5.2 네이버 친화 페이지 요건
- HTTPS 필수 ✓
- 모바일 최적화 ✓ (PWA)
- 페이지 로딩 < 3초
- 제목 태그에 핵심 키워드
- Description 100~120자
- 이미지 alt 텍스트
- 내부 링크 명확
- Open Graph (카카오톡 공유)

### §5.3 네이버 색인 일정
- 등록 후 색인까지: 약 14~16일
- 검색 노출까지: 1~4주
- 의미 있는 트래픽: 3~6개월

---

## §6. 구글 SEO

### §6.1 Search Console 등록
1. `search.google.com/search-console` 접속
2. 도메인 속성 추가 → DNS TXT 인증
3. 사이트맵 제출
4. URL 검사 → 주요 페이지 색인 요청

### §6.2 Core Web Vitals 목표
- LCP (Largest Contentful Paint): < 2.5초
- FID/INP (Interaction): < 200ms
- CLS (Cumulative Layout Shift): < 0.1

Next.js + Vercel 사용하면 대부분 자동 충족.

### §6.3 Featured Snippet 노리기
- FAQ 페이지에 `FAQPage` 스키마 → "더 보기" 박스 노출
- 표 형태 콘텐츠 → "표" 답변 노출
- 단계별 가이드 → "How to" 답변 노출

---

## §7. 콘텐츠 작성 SEO 원칙

### §7.1 키워드 배치
- **제목 (H1)**: 핵심 키워드 자연스럽게
- **부제목 (H2/H3)**: 관련 키워드 변형
- **본문 첫 100단어**: 핵심 키워드 1~2회
- **메타 description**: 핵심 키워드 + CTA

❌ 키워드 스터핑 X (같은 단어 반복은 패널티)

### §7.2 최소 분량
- 가이드: 2,500자+ (long-form)
- 회차 페이지: 800자+ (자동 + 코멘트)
- 행운템: 1,000자+ (카테고리 설명 + 상품들)

### §7.3 내부 링크
- 모든 페이지에서 관련 페이지로 2~5개 링크
- 앵커 텍스트는 자연스럽게 (키워드 그대로 X)

예:
> "당첨금 세금이 궁금하다면 [세금 계산기](/calculator/tax)로 확인해보세요."

### §7.4 외부 신뢰 신호
- 동행복권 공식 (dhlottery.co.kr) 출처 표기
- 정부 데이터 (data.go.kr) 출처 표기
- 언론 보도 인용

---

## §8. 모니터링 KPI

| 지표 | 도구 | 3개월 목표 | 6개월 목표 |
|---|---|---|---|
| 구글 색인 페이지 | Search Console | 500+ | 1,500+ |
| 네이버 색인 페이지 | 서치어드바이저 | 200+ | 1,000+ |
| 구글 노출수 | Search Console | 월 10만+ | 월 100만+ |
| 구글 클릭수 | Search Console | 월 5천+ | 월 5만+ |
| 평균 노출 순위 | Search Console | 30위 이하 | 15위 이하 |
| 상위 10위 키워드 | Search Console | 20개+ | 100개+ |

---

## §9. 절대 하지 말 것

- ❌ 다른 사이트 콘텐츠 복사
- ❌ 키워드 스터핑
- ❌ "100% 당첨" 허위 광고
- ❌ PBN(Private Blog Network) 백링크 구매
- ❌ Cloaking (봇과 사용자에게 다른 콘텐츠)
- ❌ AI 콘텐츠 100% 그대로 발행 (사람 검토 1회 필수)
- ❌ 사행성 조장 표현

# §6. 광고/수익화 구현

> 황금률: **사용자가 "핵심 가치를 받는 순간"을 절대 광고로 막지 않는다.**

---

## §1. 단계별 수익원

| 단계 | 시점 | 수익원 |
|---|---|---|
| **출시 즉시** | 출시 | 쿠팡 파트너스 (행운템) |
| **6주 후** | AdSense 신청 | (대기) |
| **AdSense 승인 후** | 약 2~3개월차 | + AdSense 디스플레이 |
| **Phase 3 (TWA)** | 9개월 후 | 변동 없음 (웹과 동일) |
| **Phase 4 (iOS 네이티브)** | 12개월+ | + AdMob 보상형 + IAP |

---

## §2. AdSense 구현

### §2.1 환경변수 분기 패턴 ⭐ (필수)

`components/ads/AdSenseSlot.tsx`:
```typescript
'use client';

import { env } from '@/lib/utils/env';
import { useEffect } from 'react';

interface AdSenseSlotProps {
  slot: string;          // AdSense 슬롯 ID
  format?: 'auto' | 'fluid';
  className?: string;
  label?: boolean;       // "광고" 라벨 표시 (기본 true)
}

export function AdSenseSlot({ slot, format = 'auto', className, label = true }: AdSenseSlotProps) {
  // AdSense ID 없으면 광고 영역 자체를 숨김
  if (!env.ADSENSE_CLIENT_ID) {
    return null;
  }

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={className}>
      {label && (
        <div className="text-xs text-muted-foreground text-center mb-1">광고</div>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={env.ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

`app/layout.tsx`에 AdSense 스크립트 (환경변수 분기):
```typescript
{env.ADSENSE_CLIENT_ID && (
  <Script
    async
    src={`https://pagead2.googleusercontent.com/pagead/js/adsbygoogle.js?client=${env.ADSENSE_CLIENT_ID}`}
    crossOrigin="anonymous"
    strategy="afterInteractive"
  />
)}
```

→ **승인 전에도 코드 작성, 환경변수만 비워두면 광고 안 보임.**

### §2.2 페이지별 광고 배치 ⭐ (필수 규칙)

| 페이지 | 광고 위치 | 형식 |
|---|---|---|
| 홈 | 당첨번호·매칭 결과 **아래** | 디스플레이 1개 |
| 회차 상세 | 당첨자 정보 아래 | 디스플레이 1개 + 행운템 카드 3개 |
| **세금 계산기** | 결과 카드 **아래만** | 디스플레이 1개 |
| **사용 계획 계산기** | ⛔ **광고 없음** | (핵심 가치 보호) |
| 번호 생성기 | 5세트 중간 1개 + 하단 1개 | 인-피드 + 디스플레이 |
| 통계 | 카드 사이 | 인-피드 1~2개 |
| 판매점 | 카드 5개마다 | 네이티브 1개 + 행운템 |
| **행운템** | 100% 쿠팡 파트너스 | (광고 X, 페이지 자체가 광고) |
| 가이드 | 본문 중간 1개, 하단 1개 | 디스플레이 |

### §2.3 절대 금지

- ❌ 당첨번호 확인 화면 위/사이
- ❌ 계산 결과 직전 인터스티셜
- ❌ 첫 진입 스플래시 광고
- ❌ 가운데 팝업 (X 버튼 작게)
- ❌ 자동 재생 비디오
- ❌ 스크롤 따라다니는 스티키 광고
- ❌ "다시 생성" 버튼 클릭 시 광고

---

## §3. 쿠팡 파트너스 — 행운템 코너

### §3.1 가입
1. `partners.coupang.com` 가입 (개인 가능)
2. 사이트 등록 (`[DOMAIN]`)
3. 추적 ID 발급 (`AF00XXXXXX`)
4. 환경변수 `NEXT_PUBLIC_COUPANG_PARTNERS_ID` 입력

### §3.2 상품 데이터 구조

`content/lucky-items/{category}.json`:
```json
[
  {
    "id": "fs-001",
    "name": "황금 두꺼비 부적",
    "price": 8900,
    "originalPrice": 12000,
    "rating": 4.7,
    "reviewCount": 1234,
    "imageUrl": "https://...",
    "coupangUrl": "https://link.coupang.com/...?lptag={PARTNERS_ID}",
    "shortDesc": "재물운 상징, 입에 동전을 물고 있어 부를 부름",
    "category": "feng-shui",
    "tags": ["재물운", "금전운", "사업"],
    "rank": 1
  }
]
```

### §3.3 상품 카드 컴포넌트

`components/lucky-items/ProductCard.tsx`:
```typescript
'use client';

interface ProductCardProps {
  product: LuckyProduct;
  position?: 'inline' | 'grid' | 'feature';
}

export function ProductCard({ product, position = 'grid' }: ProductCardProps) {
  return (
    <a
      href={product.coupangUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"  // SEO 중요
      className="..."
      onClick={() => {
        // GA 이벤트 추적
        gtag('event', 'click', {
          event_category: 'coupang_partners',
          event_label: product.id,
        });
      }}
    >
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="text-sm">{product.shortDesc}</p>
      <div className="text-lg font-bold text-red-600">
        {formatKRW(product.price)}
      </div>
      <div className="text-xs text-muted-foreground">
        ⭐ {product.rating} ({product.reviewCount}+ 리뷰)
      </div>
    </a>
  );
}
```

### §3.4 필수 고지 (모든 페이지)

`components/lucky-items/CoupangNotice.tsx`:
```typescript
export function CoupangNotice() {
  return (
    <div className="rounded border bg-muted/50 p-3 text-xs text-muted-foreground my-4">
      ⓘ 이 페이지는 쿠팡 파트너스 활동의 일환으로 일정액의 수수료를 제공받습니다.
      가격은 변동될 수 있으며, 자세한 정보는 쿠팡에서 확인하세요.
    </div>
  );
}
```

→ 모든 `/lucky-items/*` 페이지 + 행운템 카드가 들어가는 모든 페이지에 표시.

### §3.5 콘텐츠 + 광고 결합 (가장 자연스러운 형태)

판매점 페이지의 예:
```typescript
// app/stores/top-luck-spots/page.tsx
<div>
  <h1>이번 주 1등 명당</h1>
  <StoreCard store={topStore} />
  
  <Section title="💡 1등 배출 판매점 손님들이 자주 가지는 행운템">
    <ProductCard product={fengShuiToad} />
    <ProductCard product={luckyCharm} />
    <ProductCard product={crystal} />
  </Section>
  
  <CoupangNotice />
</div>
```

→ **광고가 사용자에게 가치를 제공하는 케이스.**

---

## §4. 광고 빈도 캡 (Frequency Capping)

- 같은 사용자에게 동일 광고 1일 3회 이하
- 인터스티셜은 세션당 1회 이하 (어차피 우리는 안 씀)
- "다시 생성" 같은 빈번한 액션 시 광고 없음

---

## §5. A/B 테스트 (출시 6개월 후)

광고 배치/형식이 안정화되면 다음 비교:
- 광고 위치별 이탈률
- 세션 길이 변화
- 재방문율 변화
- eCPM과 사용자 만족도 균형

도구: Vercel A/B 테스팅 또는 PostHog (무료)

---

## §6. 광고 차단기 사용자 대응

차단기 사용자가 30~40% 정도 (한국 기준). 이들에게도 콘텐츠는 정상 제공:
```typescript
// 광고 영역이 안 로드되어도 페이지 레이아웃 안 깨지게
// CSS로 광고 div에 min-height 설정 X
// 광고 로드 실패 시 자연스럽게 다음 콘텐츠로
```

→ "광고 차단기 꺼주세요" 같은 강제 메시지 절대 X (사용자 이탈만 유발)

---

## §7. Phase 4 (iOS 앱): AdMob 보상형 + IAP

**구현 시점: 12개월 이후, 별도 PRD로 다룸.**

미리 준비할 코드 마커:
```typescript
// TODO(phase-4): AdMob 보상형 광고로 통계 잠금 해제
// TODO(phase-4): IAP로 광고 제거 결제 (₩2,200 6개월)
```

---

## §8. 수익 KPI (월별 추적)

| 지표 | 도구 | 추적 빈도 |
|---|---|---|
| AdSense 수익 | AdSense Dashboard | 매일 |
| 쿠팡 파트너스 수익 | Partners Dashboard | 매주 |
| eCPM | AdSense | 매주 |
| 페이지별 광고 클릭률 | AdSense + GA | 매월 |
| 광고 차단기 비율 | 자체 측정 | 매월 |
| 이탈률 (광고 페이지 vs 비광고) | GA4 | 매월 |

---

## §9. 솔직한 수익 전망

| 시점 | MAU | 월 수익 (현실적) |
|---|---|---|
| 1개월 | 1,000~2,000 | 0~5,000원 (쿠팡만) |
| 3개월 | 5,000 | 1~5만원 |
| 6개월 | 10,000~30,000 | 10~70만원 |
| 12개월 | 30,000~100,000 | 50~500만원 |

> 80%는 6개월 안에 실패. 살아남으면 1년 후 의미 있는 수익.

# §7. 콘텐츠 페이지 템플릿

> 가이드 글, 회차 페이지, 행운템 페이지의 구조 템플릿.

---

## §1. 가이드 글 템플릿 (long-form)

### 구조
```markdown
---
title: ""           # SEO 제목 (60자)
description: ""     # SEO 설명 (120자)
keywords: []        # 5~10개
slug: /guide/...
canonical: ...
ogImage: /og/...
publishedAt: 2026-05-XX
updatedAt: 2026-05-XX
faqSchema: true     # FAQ 스키마 적용 여부
---

# 제목

**한 줄 요약**: ...

> 💡 관련 도구 CTA → [링크]

---

## 한눈에 보는 (표 형태)

| ... | ... |

---

## 1. 첫 번째 주제
[2~3 단락]

## 2. 두 번째 주제 (예시 포함)
### 예시 1: ...
### 예시 2: ...

## 3. ...

---

## 자주 묻는 질문 (FAQ)

### Q1. ...
**답변...**

### Q2. ...

---

## 관련 가이드
- [링크 1](/...)
- [링크 2](/...)

---

> ⚠️ 면책 조항: 본 가이드는 일반 정보 제공이며 법적 자문이 아닙니다.
> 최종 업데이트: 2026.05.XX
```

### 작성 원칙
- **2,500자 이상** (long-form 우대)
- 핵심 키워드 자연스럽게 (스터핑 X)
- FAQ 5~10개 (스키마 활용)
- 내부 링크 3~5개
- 외부 신뢰 출처 1~2개 (동행복권, data.go.kr)
- "본 글의 최종 업데이트일" 명시

### 이미 작성된 가이드 (별도 파일)
- `content/guides/tax.md` — 세금 가이드 (이전 대화에서 작성)
- `content/guides/how-to-claim.md` — 수령 방법 (이전 대화에서 작성)
- `content/guides/after-winning.md` — 당첨 후 행동 (작성 필요)

---

## §2. 회차 페이지 템플릿 (자동 생성)

### 기본 구조
```typescript
// app/draw/[no]/page.tsx

export default async function DrawPage({ params }) {
  const draw = await getDraw(Number(params.no));
  
  return (
    <article>
      <header>
        <h1>로또 {draw.drwNo}회 당첨번호</h1>
        <p>{formatDate(draw.drwNoDate)} 추첨</p>
      </header>
      
      <section aria-label="당첨번호">
        <LottoBallSet numbers={draw.numbers} bonus={draw.bonus} />
      </section>
      
      <section aria-label="당첨자 정보">
        <h2>등수별 당첨자 현황</h2>
        <PrizeTable draw={draw} />
      </section>
      
      <section aria-label="회차 통계">
        <h2>이번 회차 통계</h2>
        <ul>
          <li>홀짝 비율: {oddEvenStr}</li>
          <li>저고 비율: {lowHighStr}</li>
          <li>당첨번호 합계: {sum}</li>
          <li>연속 번호: {consecCount}개</li>
        </ul>
      </section>
      
      {/* 수동 코멘트 (있으면) */}
      {draw.comment && (
        <section>
          <h2>이번 회차 특이점</h2>
          <p>{draw.comment}</p>
        </section>
      )}
      
      <AdSenseSlot slot="..." />
      
      <section aria-label="1등 판매점">
        <h2>1등 당첨 판매점</h2>
        <StoreList stores={draw.firstPrizeStores} />
      </section>
      
      <section aria-label="다음 회차">
        <h2>다음 회차 예상 분석 → <Link href="/stats">통계 보기</Link></h2>
        <h2>내 번호 매칭하기 → <Link href="/my-numbers">바로가기</Link></h2>
      </section>
      
      <section aria-label="행운템">
        <h2>이번 회차 행운템 추천</h2>
        <ProductGrid products={featuredProducts} />
        <CoupangNotice />
      </section>
      
      <DrawJsonLd draw={draw} />
    </article>
  );
}
```

### 수동 코멘트 운영
매주 추첨 후 5~10분 투자해 "이번 회차 특이점" 한 줄 추가:
- "1등 당첨자가 24명으로 평소(15~18명)보다 많았습니다."
- "당첨번호 합계 147로 평균 범위(120~150) 내."
- "연속 번호 2개 포함 (32, 33)"

→ 자동 콘텐츠 + 수동 코멘트 = SEO 품질 ↑

---

## §3. 번호별 통계 페이지 (45개)

```typescript
// app/stats/number/[n]/page.tsx

export async function generateStaticParams() {
  return Array.from({length: 45}, (_, i) => ({ n: String(i + 1) }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const n = Number(params.n);
  const stats = await getNumberStats(n);
  return {
    title: `로또 ${n}번 출현 통계 | 총 ${stats.totalCount}회 등장`,
    description: `로또 ${n}번이 1회차부터 현재까지 총 ${stats.totalCount}회 출현. 출현율 ${stats.rate}%, 최근 출현 ${stats.lastDrawNo}회.`,
    alternates: { canonical: `/stats/number/${n}` },
  };
}

export default function NumberStatsPage({ params }) {
  // 번호별 상세 통계
}
```

---

## §4. 시군구별 판매점 페이지

```typescript
// app/stores/city/[sigungu]/page.tsx

export async function generateMetadata({ params }): Promise<Metadata> {
  const sigungu = decodeURIComponent(params.sigungu);
  const stores = await getStoresInSigungu(sigungu);
  const firstPrizeCount = stores.filter(s => s.firstPrizeCount > 0).length;
  
  return {
    title: `${sigungu} 로또 판매점 ${stores.length}곳 | 1등 명당 ${firstPrizeCount}곳`,
    description: `${sigungu} 지역 로또 6/45 판매점 ${stores.length}곳 전체 리스트. 1등 배출 명당 ${firstPrizeCount}곳 포함.`,
  };
}
```

---

## §5. 행운템 카테고리 페이지

```markdown
---
title: "풍수 인테리어 추천 BEST | 로또 명당 손님들의 행운템"
description: "재물운, 금전운을 부르는 풍수 인테리어 추천. 황금 두꺼비, 부엉이, 해태상 등 의미와 함께 큐레이션."
keywords: ["풍수 인테리어", "재물운 풍수", "행운 부적", "황금 두꺼비"]
slug: /lucky-items/feng-shui
---

# 풍수 인테리어 추천 BEST

**한 줄 요약**: 풍수에서 재물운·금전운을 부른다고 알려진 아이템들을 의미와 함께 큐레이션했습니다.

> ⓘ 본 페이지는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다.

---

## 풍수 인테리어란?

[설명 단락 — 풍수의 기본 개념, 재물운에 좋은 방향, 색상 등]

---

## TOP 10 풍수 아이템

### 1. 황금 두꺼비 (재물운 1위)

**의미**: 입에 동전을 물고 있는 황금 두꺼비는 풍수에서 재물을 부르는 대표 상징입니다...

[ProductCard]

### 2. 부엉이 (지혜와 재물)

[설명 + ProductCard]

### 3. ...

---

## 어디에 놓아야 할까?

- 현관: 들어오는 재물을 맞이 (두꺼비, 부엉이)
- 거실 동쪽: 가족 화목 (옥, 자수정)
- 사무실 책상: 사업운 (해태상, 황금 코끼리)

---

## 관련 카테고리
- [행운의 부적](/lucky-items/charms)
- [크리스탈·천연석](/lucky-items/crystal)
- [12지신 띠별 행운템](/lucky-items/zodiac/2026)

---

> ⓘ 위 상품은 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다.
> 가격·재고는 변동될 수 있으니 자세한 정보는 쿠팡에서 확인하세요.
```

---

## §6. 띠별 행운템 페이지 (12개)

```typescript
// app/lucky-items/zodiac/[year]/page.tsx
// 단순화: 띠별이 아니라 연도별로 12지신 묶음

const ZODIAC_2026 = [
  { sign: '쥐띠', years: '1948, 1960, 1972, 1984, 1996, 2008, 2020', luckyItems: [...] },
  { sign: '소띠', ... },
  // ...
];
```

URL: `/lucky-items/zodiac/2026` (연도별 1페이지)

---

## §7. SEO 콘텐츠 작성 체크리스트

페이지 발행 전 매번 확인:

- [ ] 제목 60자 이내
- [ ] description 120자 이내
- [ ] H1 1개, H2/H3 계층 명확
- [ ] 본문 첫 100단어에 핵심 키워드 1~2회
- [ ] 이미지 alt 텍스트
- [ ] 내부 링크 2~5개
- [ ] FAQ 섹션 (해당 시)
- [ ] JSON-LD 스키마
- [ ] canonical URL
- [ ] OG 이미지
- [ ] 면책 조항 (필요 시)

---

## §8. 콘텐츠 발행 루틴 (출시 후 매주)

### 매주 토요일 (추첨 후)
- 회차 페이지 자동 생성 확인
- 수동 코멘트 1줄 추가 (5분)

### 매주 1~2회 (평일)
- 가이드 글 1개 추가 또는 기존 글 보강
- 또는 행운템 신상품 5개 추가

### 매월 첫째 주
- 전월 SEO 성과 리뷰 (Search Console)
- 노출 많은데 클릭률 낮은 페이지 → 제목 개선
- 색인 안 된 페이지 → URL 직접 제출

# §8. 함정 및 주의사항

> 시간 낭비 방지. 이거 안 읽으면 W2~W9에서 반복적으로 막힘.

---

## §1. 동행복권 API 함정

### ⚠️ 1.1 비공식 API
- 공식 API 없음. `dhlottery.co.kr` 페이지 분석한 비공식 엔드포인트만 존재
- 정책 변경 시 갑자기 차단 가능

### ⚠️ 1.2 IP 차단 위험
- 클라이언트 직접 호출 → IP 차단 가능
- **반드시 Cloudflare Workers 프록시 경유**
- Workers IP는 분산되어 차단 위험 낮음

### ⚠️ 1.3 User-Agent 헤더 필수
```typescript
fetch(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; Goldlotto/1.0; +https://[DOMAIN])',
  }
});
```
없으면 403 에러.

### ⚠️ 1.4 응답 인코딩
- 응답이 EUC-KR일 수 있음 (가끔)
- JSON 파싱 실패 시 인코딩 변환 시도

### ⚠️ 1.5 추첨 시간 ≠ API 반영 시간
- 추첨: 토요일 20:40 KST (TV 방송)
- API 반영: 약 21:00 KST (변동 있음)
- cron은 **21:00부터 24:00까지 5분 간격으로 폴링** + 새 회차 감지 시 중단

---

## §2. 세금 계산 함정

### ⚠️ 2.1 10원 미만 절사 누락
**가장 흔한 버그.** `Math.floor(tax / 10) * 10` 빼먹으면 1원 단위 오차.

테스트 케이스에 절사 검증 필수:
```typescript
expect(calcTax(5_000_000)).toBe(1_099_780); // 1,099,780 (10원 단위)
// NOT: 1,099,778 (절사 X)
```

### ⚠️ 2.2 복권 구입비 1,000원 차감
```typescript
// 정답
const base = prize - 1000;
const tax = base * 0.22;

// 오답
const tax = prize * 0.22; // 1,000원에도 세금 매김
```

### ⚠️ 2.3 3억 경계 처리
- 3억 **이하**까지는 22%
- 3억 **초과분**부터 33%
- `base <= 300_000_000` (등호 포함)

### ⚠️ 2.4 부동소수점 오차
```typescript
// 위험
const tax = base * 0.22; // 부동소수점 오차 가능

// 안전
const tax = Math.floor((base * 22) / 100); // 정수 연산
```

### ⚠️ 2.5 BigInt 함정 (사용 X)
- JavaScript의 `Number`는 2^53까지 정수 정확
- 우리 최대 금액: 30억 (3 × 10^9) → `Number`로 충분
- BigInt 사용 X (오버스펙, 코드 복잡)

---

## §3. Next.js 14 함정

### ⚠️ 3.1 Server vs Client Component
- 기본은 Server Component (브라우저 API 사용 불가)
- IndexedDB, localStorage, window 사용 시 `'use client'` 디렉티브 필수
- 사용 계획 계산기, 번호 생성기 등은 모두 Client Component

### ⚠️ 3.2 generateStaticParams + 1,200개
- 빌드 시 1,200개 페이지 동시 생성 → 빌드 시간 길어짐
- ISR 활용: `revalidate = 86400` (24시간)
- Vercel Hobby는 빌드 시간 제한 있음 (45분)

```typescript
export async function generateStaticParams() {
  // 초기 빌드: 최근 100회차만 SSG
  // 나머지는 첫 방문 시 ISR로 생성
  const latest = await getLatestDrawNo();
  return Array.from({length: 100}, (_, i) => ({ no: String(latest - i) }));
}

export const revalidate = 86400;
export const dynamicParams = true; // 나머지는 ISR로
```

### ⚠️ 3.3 metadata 동적 생성
```typescript
// generateMetadata는 async 가능
export async function generateMetadata({ params }): Promise<Metadata> {
  const draw = await getDraw(params.no);
  return { title: `...` };
}
```

### ⚠️ 3.4 환경변수 노출
- `NEXT_PUBLIC_*` → 클라이언트 노출
- 나머지 → 서버에서만
- Firebase Admin SDK 키는 절대 `NEXT_PUBLIC_*`에 넣지 말 것

---

## §4. Firebase 함정

### ⚠️ 4.1 무료 한도
- Firestore: 일 5만 read, 2만 write
- 초과 시 → 해당 일 동안 작업 거부 (신용카드 미등록 시)
- MAU 5천 넘으면 한도 거의 도달

### ⚠️ 4.2 보안 규칙
**기본은 모두 차단**. 명시적으로 허용 필요:
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 회차/판매점은 누구나 읽기
    match /draws/{drawId} {
      allow read: if true;
      allow write: if false; // Workers만 가능 (Admin SDK)
    }
    match /stores/{storeId} {
      allow read: if true;
      allow write: if false;
    }
    
    // 사용자 데이터는 Firestore에 절대 저장 X (IndexedDB 사용)
  }
}
```

### ⚠️ 4.3 리전 선택
- `asia-northeast3` (서울) → 한국 사용자에게 가장 빠름
- 한 번 정하면 변경 불가

### ⚠️ 4.4 FCM iOS 푸시
- iOS는 Safari 16.4+에서만 Web Push 지원
- "홈 화면에 추가" 후에만 동작
- 안드로이드는 거의 다 가능

---

## §5. PWA 함정

### ⚠️ 5.1 next-pwa 설정
```typescript
// next.config.mjs
import withPWA from 'next-pwa';

const config = {
  // ...
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // 개발 시 끄기
  register: true,
  skipWaiting: true,
})(config);
```

### ⚠️ 5.2 매니페스트 아이콘
- 192x192, 512x512 필수
- `purpose: 'maskable'` 버전도 권장
- 모든 아이콘 `public/icons/` 에 저장

### ⚠️ 5.3 HTTPS 필수
- PWA, Service Worker는 HTTPS만
- Vercel은 자동 HTTPS (걱정 X)
- 로컬 개발은 `localhost`에서만 가능

---

## §6. Naver Maps 함정

### ⚠️ 6.1 API 키 발급
1. `developers.naver.com` 가입
2. 애플리케이션 등록 (이름: 황금로또)
3. **Web Dynamic Map** 선택
4. 웹 서비스 URL 등록 (도메인 + localhost:3000)
5. Client ID, Client Secret 발급

### ⚠️ 6.2 도메인 화이트리스트
- 등록한 도메인에서만 작동
- localhost:3000 개발 시 별도 등록

### ⚠️ 6.3 SDK 로드
```html
<!-- app/layout.tsx -->
<Script
  src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${env.NAVER_MAP_CLIENT_ID}`}
  strategy="beforeInteractive"
/>
```

### ⚠️ 6.4 사용량 한도
- 월 30만 호출 무료
- 초과 시 자동 차단 (안전)
- 지도 표시 외 지오코딩 API는 별도 한도

---

## §7. AdSense 함정

### ⚠️ 7.1 신청 거절 사유 (자주 발생)
- 콘텐츠 부족 (출시 6주 이상 + 50페이지+ 권장)
- About/Contact/Privacy 페이지 누락
- 무료 서브도메인 (vercel.app 등) → 자체 도메인 필수
- 복사된 콘텐츠

### ⚠️ 7.2 사행성 정책
- "확률 높은 번호", "당첨 보장" 같은 표현 X
- 면책 고지 페이지마다 명시
- 미성년자 대상 콘텐츠 X
- 도박 권유 X (정보 제공만)

### ⚠️ 7.3 PIN 인증
- 첫 수익 $10 달성 후 우편으로 PIN 발송
- 도착까지 2~4주
- 도착 후 입력해야 광고 계속 게재

### ⚠️ 7.4 광고 코드 위치
- `<head>`에 메인 스크립트
- 각 광고 슬롯에 `<ins>` 태그
- 광고 코드 수정 X (Google 자동 관리)

---

## §8. 쿠팡 파트너스 함정

### ⚠️ 8.1 필수 고지
- 모든 페이지에 "쿠팡 파트너스 활동" 명시
- 누락 시 계정 정지 가능

### ⚠️ 8.2 가짜 정보 금지
- 가격, 별점, 리뷰 수 정확히 표시
- 거짓 가격 표시 시 계정 정지

### ⚠️ 8.3 rel="sponsored" 필수
```html
<a href="..." rel="noopener noreferrer sponsored">
```
SEO 점수에도 영향. 빼면 패널티.

### ⚠️ 8.4 정산
- 결제 완료 후 익월 정산
- 환불 시 수수료 차감
- 월 5만원 이하 시 다음 달 이월

---

## §9. SEO 함정

### ⚠️ 9.1 신규 도메인 패널티
- 새 도메인은 구글에 신뢰도 0
- 3~6개월간 의미 있는 노출 X
- 인내심 필요

### ⚠️ 9.2 중복 콘텐츠
- `/draw/latest` ≡ `/draw/1224` 같은 중복 페이지
- `canonical` URL 명시 필수
- 색인 거부 가능

### ⚠️ 9.3 사이트맵 크기 제한
- 한 사이트맵 5만 URL 이하
- 우리는 1,200+ 정도라 단일 사이트맵 OK
- 향후 확장 시 사이트맵 분할 필요

### ⚠️ 9.4 robots.txt 실수
```
# 절대 이렇게 하지 말 것
User-agent: *
Disallow: /

# 정답
User-agent: *
Allow: /
Sitemap: https://[DOMAIN]/sitemap.xml
```

---

## §10. 법적 함정

### ⚠️ 10.1 통신판매업 신고
- 쿠팡 파트너스 등 제휴 마케팅 시 신고 의무
- 등록면허세 ₩40,000
- 푸터에 신고번호 표시

### ⚠️ 10.2 개인정보처리방침
- 사용자 데이터 1개라도 수집하면 의무
- IndexedDB도 "수집"으로 간주 가능
- 템플릿 사용 가능 (무료)

### ⚠️ 10.3 사업자등록
- 연 수익 500만원+ 또는 매월 정기 수익 시 필수
- 간이사업자로 시작 권장

### ⚠️ 10.4 사행성 표현
- "100% 당첨" → 표시광고법 위반
- "확률 높은 번호" → 거짓광고
- "재미로 보는 추천 번호" 같은 톤으로

### ⚠️ 10.5 만 19세 미만
- 「복권 및 복권기금법」에 따라 미성년자 복권 구매 금지
- 사이트에 "만 19세 이상 권장" 고지

---

## §11. 빌드 / 배포 함정

### ⚠️ 11.1 Vercel 빌드 시간
- Hobby: 45분 제한
- 1,200 SSG 페이지 → 빌드 시간 길어짐
- ISR로 분산: 초기 100개만 SSG, 나머지는 첫 방문 시

### ⚠️ 11.2 환경변수 빠뜨림
- 로컬에서는 되는데 Vercel에서 안 됨
- Vercel Dashboard → Settings → Environment Variables에 모두 등록
- `.env.local`은 gitignore되어 있어서 Vercel은 모름

### ⚠️ 11.3 빌드 캐시
- 의존성 변경 시 캐시 무효화
- 빌드 실패 시 "Redeploy without cache" 시도

---

## §12. 시간 함정

### ⚠️ 12.1 KST vs UTC
- 동행복권 추첨: 토요일 20:40 KST
- Cloudflare Workers cron: UTC 기준
- 토요일 20:40 KST = **토요일 11:40 UTC**

```toml
[triggers]
# 토요일 12:00~15:00 UTC (KST 21:00~24:00), 5분 간격
crons = ["*/5 12-15 * * 6"]
```

### ⚠️ 12.2 회차 발표일
- 일부 회차는 다음날(일요일) 발표 (조사 등 이슈)
- cron이 일요일까지 폴링하도록

### ⚠️ 12.3 일정 변경 (드물게)
- 명절, 특별 이슈로 추첨일 변경 가능
- 동행복권 공지 모니터링 필요

---

## §13. 데이터 일관성 함정

### ⚠️ 13.1 회차 번호 vs 날짜
- 보통 1주 1회차지만 예외 가능
- 1주에 2회차, 0회차 가능성 있음
- 회차 번호로만 식별 (날짜 의존 X)

### ⚠️ 13.2 IndexedDB 마이그레이션
- Dexie 스키마 변경 시 버전 업그레이드 필수
```typescript
this.version(2).stores({
  plans: 'id, name, createdAt, updatedAt, *tags', // 인덱스 추가
});
```

### ⚠️ 13.3 사용자 데이터 백업
- IndexedDB는 사용자가 브라우저 데이터 삭제 시 사라짐
- "내보내기" 기능 제공 (JSON 다운로드)
- "가져오기" 기능도 함께

---

## §14. UX 함정

### ⚠️ 14.1 로또볼 색상
- 1-10: 노랑, 11-20: 파랑, 21-30: 빨강, 31-40: 회색, 41-45: 초록
- 색맹 사용자 고려 → 숫자도 충분히 크게

### ⚠️ 14.2 모바일 우선
- 70%+ 모바일 트래픽 예상
- 터치 영역 최소 44x44px
- 가로 스크롤 절대 금지

### ⚠️ 14.3 천 단위 콤마
- 금액 입력 시 자동 콤마
- 표시 시 콤마 (1,234,567원)
- 큰 금액은 한국식 단위 ("12억 3,456만원")

---

## §15. 절대 하지 말 것 (Top 10)

1. ❌ 동행복권 API 클라이언트 직접 호출
2. ❌ 사용자 개인정보를 Firestore에 저장
3. ❌ 광고를 핵심 가치(당첨번호) 위에 배치
4. ❌ AdSense 코드 환경변수 없이 하드코딩
5. ❌ "확률 높은 번호" 같은 표현
6. ❌ 다른 사이트 콘텐츠 복사
7. ❌ AI 콘텐츠 검토 없이 발행
8. ❌ HTTPS 없는 배포
9. ❌ TypeScript strict 끄기
10. ❌ 테스트 없이 세금 계산 변경

---

## 📝 문서 사용 안내

### 도메인 교체 방법
도메인 구매 후 (예정: `goldenlotto.co.kr`):
1. 이 문서에서 `[DOMAIN]`을 모두 `goldenlotto.co.kr`로 치환
2. 코드의 환경변수 `NEXT_PUBLIC_SITE_URL=https://goldenlotto.co.kr`로 설정
3. `.env.example`도 업데이트

### 버전 이력
- **v1.0 (2026-05-11)**: 초기 통합본
  - 기획자: Claude Opus
  - 6회 대화 + 4회 정정 반영
  - 도메인: goldenlotto.co.kr (구매 예정)
  - 핵심 기능 8개 확정
  - PWA → TWA → iOS 단계적 출시 전략
  - AdSense + 쿠팡 파트너스 수익화

### 변경 시 규칙
- 사양 변경 시 이 문서의 해당 §번호 업데이트
- commit 메시지에 `docs(§X.Y): ...` 형식 사용
- 큰 변경은 v1.1, v1.2 등으로 버전업

---

> **이 문서는 SSOT입니다.** 코드와 이 문서가 충돌하면 이 문서를 우선합니다.
> **모르는 게 있으면 추측하지 말고 사용자에게 질문하세요.**

🎰 행운을 빕니다!
