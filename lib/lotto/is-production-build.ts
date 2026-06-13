/** `next build` 정적 생성 단계 — 동행복권 API 호출 생략용 */
export function isNextProductionBuild(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}
