# 황금로또 (Goldlotto)

로또 6/45 정보·세금 계산·(예정) 사용 계획·통계 PWA. 기획의 단일 기준은 `files/CURSOR_BRIEF.md`입니다.

## 요구 사항

- Node.js 20 LTS 권장
- npm 10+

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3040](http://localhost:3040) 을 엽니다.

### Windows PowerShell에서 `npm` 오류가 날 때

`npm.ps1` 실행이 막히면(실행 정책) 아래 중 하나를 쓰세요.

1. **프로젝트 폴더에서 `dev.bat` 더블클릭** 또는 터미널에서 `.\dev.bat`

개발 중 화면/API가 **500 · 서버 에러**이고 터미널에 `Cannot find module './xxx.js'`가 보이면, 서버를 끈 뒤 `clean-dev.bat` 실행 → `dev.bat`으로 다시 시작하세요. (`.next` 캐시 꼬임)
2. **CMD 사용**: `npm.cmd run dev` (PowerShell에서도 동작)
3. **현재 사용자만 스크립트 허용** (한 번만):

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint |
| `npm test` | Vitest (세금·포맷 유틸) |

## 환경 변수

`.env.example`을 복사해 `.env.local`로 두고 값을 채웁니다.

## 현재 구현

- Next.js 14 App Router, TypeScript strict, Tailwind
- **홈** (`/`) — 최신 회차 당첨번호·1등 당첨금·세후 예상 (동행복권 lt645 API)
- **세금 계산기** (`/calculator/tax`) — 회차·등수 / 금액 직접 입력, 추첨일 선택
- **사용 계획 계산기** (`/calculator/spending-plan`) — 카테고리별 배분·위시리스트·도넛 차트·플랜 저장(IndexedDB)
- **번호 생성기** (`/generator`) — 1~45 번호판 직접 선택(0~6개)·통계 추천 5세트
- API: `/api/lotto/latest`, `/api/lotto/schedule`, `/api/lotto/[drwNo]`
- 세금·화폐 포맷 유틸 + Vitest
- 브랜드 로고(SVG), 법적 플레이스홀더 페이지
