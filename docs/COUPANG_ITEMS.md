# 행운템 20~30개 — 쿠팡 파트너스 등록 가이드

> **코드 준비 완료:** 상품 JSON + `/lucky-items/item/[slug]` 상세페이지  
> **본인 작업:** 쿠팡에서 실상품 20~30개 골라 JSON에 붙여넣기

---

## 현재 구조

| 구분 | 경로 | 설명 |
|------|------|------|
| 카테고리 목록 | `/lucky-items/feng-shui` 등 | 5개 카테고리 |
| **상품 상세** | `/lucky-items/item/golden-toad` | SEO·본문·쿠팡 CTA |
| 데이터 | `content/lucky-items/*.json` | 카테고리별 JSON |

**지금:** 카테고리당 10개 × 5 = **50개 플레이스홀더** (검색 URL, 이모지만)  
**목표:** **20~30개 실상품** + 딥링크 + (가능하면) 상품 이미지

### 권장 개수 (총 25개 예시)

| 파일 | 카테고리 | 개수 |
|------|----------|------|
| `feng-shui.json` | 풍수·개운 | 6 |
| `charms.json` | 부적·키링 | 6 |
| `crystal.json` | 크리스탈 | 5 |
| `this-week.json` | 이번 주 픽 | 5 |
| `zodiac.json` | 띠별 | 3 |
| **합계** | | **25** |

나머지 플레이스홀더는 JSON에서 **삭제**해도 됩니다.

---

## Step 1 — 쿠팡 파트너스 가입

1. [partners.coupang.com](https://partners.coupang.com) 가입
2. **사이트 등록:** `https://goldenlotto.co.kr` (배포 후 승인)
3. **추적 ID** 발급 (예: `AF1234567`)
4. Vercel env: `NEXT_PUBLIC_COUPANG_PARTNERS_ID=AF1234567`

---

## Step 2 — 상품 고르기 (20~30개)

로또·행운 테마에 맞는 키워드로 쿠팡 검색:

- 로또 보관함, 복권 지갑
- 황금 두꺼비, 행운 고양이, 크리스탈 트리
- 부적 키링, 복주머니, 엽전
- 금색 볼펜, 행운 양말
- 2026 띠 키링 (말띠 등)

**선정 기준 (실용):**

- 가격 **5천~3만 원** (충동구매 구간)
- 리뷰 **50개+**, 별점 **4.0+**
- 로또·풍수·선물과 **스토리 연결** 가능한 것

---

## Step 3 — 파트너스 링크 복사

상품 페이지에서:

1. 파트너스 대시보드 → **링크 생성** (또는 브라우저 확장/북마클릿)
2. 생성된 URL 형식 예:
   ```
   https://link.coupang.com/a/AF1234567?redirectUrl=https%3A%2F%2Fwww.coupang.com%2Fvp%2Fproducts%2F...
   ```
3. 이 URL 전체를 JSON의 `coupangUrl`에 넣기  
   → **검색 URL보다 전환율 훨씬 높음**

---

## Step 4 — JSON 한 줄 템플릿

`content/lucky-items/feng-shui.json` 참고 (`golden-toad` 예시):

```json
{
  "id": "feng-shui-002",
  "slug": "money-turtle",
  "name": "실제 상품명 (쿠팡과 동일)",
  "price": 12800,
  "rating": 4.6,
  "imageEmoji": "🐢",
  "imageUrl": "https://thumbnail.coupangcdn.com/thumbnails/remote/...jpg",
  "coupangUrl": "https://link.coupang.com/a/AFxxxx?redirectUrl=...",
  "description": "카드용 한 줄 (20자 내)",
  "body": "## 왜 추천?\n\n...\n\n## 로또와 함께\n\n...",
  "category": "feng-shui",
  "tags": ["풍수", "재물운"]
}
```

| 필드 | 필수 | 설명 |
|------|------|------|
| `id` | ✅ | 파일 내 고유 (`feng-shui-002`) |
| `slug` | 권장 | URL용 영문 (`money-turtle`) — 없으면 id 사용 |
| `name`, `price`, `rating` | ✅ | 쿠팡 페이지에서 복사 |
| `coupangUrl` | ✅ | **파트너스 딥링크** |
| `description` | ✅ | 목록 카드 |
| `body` | 권장 | 상세 SEO (마크다운, 200~400자) |
| `imageUrl` | 선택 | 쿠팡 썸네일 URL (없으면 이모지) |
| `imageEmoji` | ✅ | fallback |
| `category` | ✅ | 파일명과 일치 |

### `body` 작성 팁 (5분/상품)

1. **왜 행운템인지** (2~3문장)
2. **로또와 연결** (명당·구매 전 의식·선물)
3. **구매 팁** (리뷰·가격 확인)

---

## Step 5 — 확인

```bash
npm run dev:clean
```

- `/lucky-items/feng-shui` → 카드 → **상세 보기**
- `/lucky-items/item/golden-toad` → 본문 + **쿠팡에서 최저가 확인**
- `/draw/latest` 하단 티저 → 상세페이지로 이동
- env에 `COUPANG_PARTNERS_ID` 넣은 뒤 링크에 `link.coupang.com/a/` 포함 확인

---

## Step 6 — Agent에게 맡기기

쿠팡에서 상품 고른 뒤 아래 형식으로 보내주면 JSON·본문 작성 가능:

```
상품명: OOO
가격: 12900
별점: 4.7
카테고리: feng-shui
쿠팡 링크: https://link.coupang.com/a/...
(선택) 이미지 URL: ...
```

또는 **엑셀/스프레드시트 20행** 주시면 `content/lucky-items/*.json` 일괄 반영.

---

## 주의 (쿠팡·법적)

- 상품명·가격 **과장 금지** — “최저가”는 쿠팡 페이지 기준
- **당첨 보장** 표현 금지 (이미 면책·고지 있음)
- 쿠팡 이미지 hotlink: 썸네일 URL 사용, 문제 시 `public/items/`에 저장 후 `/items/xxx.jpg`로 교체
- 행운템 페이지 **AdSense 없음** (쿠팡 제휴만)

---

**다음:** Vercel 배포 → 파트너스 사이트 승인 → 25개 채우기 → sitemap에 상세 URL 자동 포함
