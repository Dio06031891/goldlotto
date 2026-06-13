# 호스팅케이알 DNS → Vercel 연결 가이드

**도메인:** `goldenlotto.co.kr`  
**구매처:** [호스팅케이알 (hosting.kr)](https://www.hosting.kr/)  
**사이트 호스팅:** Vercel (호스팅케이알 웹호스팅 **불필요**)

---

## 전체 흐름

```
[호스팅케이알] 도메인 보유 + DNS 레코드
        ↓  A / CNAME
[Vercel] Next.js 사이트 + SSL(HTTPS) 자동
        ↓
https://goldenlotto.co.kr
```

---

## 1. Vercel에 먼저 배포

1. GitHub에 코드 push
2. [vercel.com](https://vercel.com) → **Add New Project** → 저장소 Import
3. **Environment Variables** (Production):

```env
NEXT_PUBLIC_SITE_URL=https://goldenlotto.co.kr
NEXT_PUBLIC_SITE_NAME=황금로또
NEXT_PUBLIC_CONTACT_EMAIL=6sik7192@gmail.com
```

4. Deploy 완료 후 **Settings → Domains**
5. `goldenlotto.co.kr` 입력 → Add
6. (선택) `www.goldenlotto.co.kr` 도 추가
7. Vercel이 **Invalid Configuration** 과 함께 넣을 DNS 값을 보여줌 → 아래 2단계에서 입력

---

## 2. 호스팅케이알 DNS 설정

### 로그인

1. [https://www.hosting.kr/](https://www.hosting.kr/) 로그인
2. **나의 서비스** → **도메인**
3. `goldenlotto.co.kr` 클릭

### 확인할 것

| 항목 | 설정 |
|------|------|
| 도메인 포워딩 | **사용 안 함** (켜져 있으면 Vercel과 충돌) |
| 도메인 파킹 | **사용 안 함** |
| 네임서버 | 호스팅케이알 **기본값 유지** (별도 변경 불필요) |

### DNS 레코드 추가

**DNS 관리** / **DNS 레코드** / **고급 DNS** 메뉴에서:

| 타입 | 호스트 | 값 | 비고 |
|------|--------|-----|------|
| **A** | `@` | `76.76.21.21` | 루트 도메인 |
| **CNAME** | `www` | `cname.vercel-dns.com` | www 서브도메인 |

> Vercel Domains 화면에 **다른 값**이 나오면 Vercel 안내를 따르세요.

### 호스트 이름 UI 차이

호스팅케이알 화면마다 표기가 다릅니다:

- `@` 또는 **(비움)** → `goldenlotto.co.kr` 자체
- `www` → `www.goldenlotto.co.kr`

---

## 3. SSL(HTTPS)

DNS가 Vercel에 연결되면 **Let's Encrypt SSL이 자동 발급**됩니다.  
별도로 호스팅케이알에서 SSL 인증서를 구매할 필요 **없습니다**.

---

## 4. 확인

1. Vercel → Domains → **Valid Configuration** ✅
2. 브라우저: `https://goldenlotto.co.kr`
3. `https://goldenlotto.co.kr/contact` — 이메일 버튼 확인

전파 시간: 보통 **10분~2시간** (최대 48시간)

Windows에서 확인:

```powershell
nslookup goldenlotto.co.kr
```

`76.76.21.21` 이 나오면 A 레코드 반영된 것.

---

## 5. 자주 하는 실수

| 실수 | 결과 |
|------|------|
| 호스팅케이알 **웹호스팅**까지 구매·연결 | Vercel 대신 빈 호스팅 페이지가 뜸 |
| **도메인 포워딩** 사용 | DNS A/CNAME과 충돌 |
| A 레코드만 넣고 `www` 미설정 | `www.goldenlotto.co.kr` 접속 불가 |
| Vercel env에 `localhost` URL | sitemap·OG가 잘못된 URL로 생성 |

---

## 6. 문의

- **호스팅케이알:** 1644-7378
- **Vercel:** [vercel.com/support](https://vercel.com/support)

DNS 설정 화면 캡처 + Vercel Domains 화면 캡처를 함께 보내면 해결이 빠릅니다.
