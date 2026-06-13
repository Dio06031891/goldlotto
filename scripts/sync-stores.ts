/**
 * 공공데이터포털 판매점·1등 당첨 판매점 동기화 (W7.1)
 *
 * 사용:
 *   DATA_GO_KR_API_KEY=발급키 npx tsx scripts/sync-stores.ts
 *
 * 데이터셋:
 *   - 15086355 온라인복권 판매점 주소
 *   - 15059963 1등 당첨 판매점 현황
 *
 * 지오코딩은 NAVER_MAP_CLIENT_SECRET 또는 Kakao REST 키가 있을 때만 실행하세요.
 * 현재 앱은 lib/stores/seed-luck-stores.ts 시드 데이터를 사용합니다.
 */

const key = process.env.DATA_GO_KR_API_KEY;

if (!key) {
  console.error('DATA_GO_KR_API_KEY 가 없습니다. .env.local 에 키를 넣고 다시 실행하세요.');
  console.error('https://www.data.go.kr 에서 API 활용 신청 후 사용할 수 있습니다.');
  process.exit(1);
}

console.log('1등 명당 집계는 npm run sync:stores (scripts/sync-winning-stores.mjs) 를 사용하세요.');
console.log('동행복권 API 기준 · 출력: data/stores/luck-stores.json');
console.log('공공데이터 전체 판매점 목록은 DATA_GO_KR_API_KEY 연동 후 확장 예정입니다.');
process.exit(0);
