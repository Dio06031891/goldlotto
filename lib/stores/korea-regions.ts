export type SidoInfo = {
  slug: string;
  name: string;
  shortName: string;
};

export const SIDO_LIST: SidoInfo[] = [
  { slug: 'seoul', name: '서울특별시', shortName: '서울' },
  { slug: 'busan', name: '부산광역시', shortName: '부산' },
  { slug: 'daegu', name: '대구광역시', shortName: '대구' },
  { slug: 'incheon', name: '인천광역시', shortName: '인천' },
  { slug: 'gwangju', name: '광주광역시', shortName: '광주' },
  { slug: 'daejeon', name: '대전광역시', shortName: '대전' },
  { slug: 'ulsan', name: '울산광역시', shortName: '울산' },
  { slug: 'sejong', name: '세종특별자치시', shortName: '세종' },
  { slug: 'gyeonggi', name: '경기도', shortName: '경기' },
  { slug: 'gangwon', name: '강원특별자치도', shortName: '강원' },
  { slug: 'chungbuk', name: '충청북도', shortName: '충북' },
  { slug: 'chungnam', name: '충청남도', shortName: '충남' },
  { slug: 'jeonbuk', name: '전북특별자치도', shortName: '전북' },
  { slug: 'jeonnam', name: '전라남도', shortName: '전남' },
  { slug: 'gyeongbuk', name: '경상북도', shortName: '경북' },
  { slug: 'gyeongnam', name: '경상남도', shortName: '경남' },
  { slug: 'jeju', name: '제주특별자치도', shortName: '제주' },
];

export function findSidoBySlug(slug: string): SidoInfo | undefined {
  return SIDO_LIST.find((s) => s.slug === slug);
}

export function sigunguSlug(sidoSlug: string, sigungu: string): string {
  const base = sigungu.replace(/\s+/g, '').replace(/시|군|구/g, '');
  return `${sidoSlug}-${base}`;
}

export function parseSigunguSlug(slug: string): { sidoSlug: string; sigunguKey: string } | null {
  const idx = slug.indexOf('-');
  if (idx <= 0) return null;
  return { sidoSlug: slug.slice(0, idx), sigunguKey: slug.slice(idx + 1) };
}

export function matchSigunguSlug(storeSigungu: string, sigunguKey: string): boolean {
  const norm = storeSigungu.replace(/\s+/g, '').replace(/시|군|구/g, '');
  return norm === sigunguKey || norm.startsWith(sigunguKey);
}
