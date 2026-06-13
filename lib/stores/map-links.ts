export function naverMapSearchUrl(query: string): string {
  return `https://map.naver.com/v5/search/${encodeURIComponent(query)}`;
}

export function kakaoMapSearchUrl(query: string): string {
  return `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
}

export function naverMapDirectionsUrl(lat: number, lng: number, name: string): string {
  return `https://map.naver.com/v5/directions/-/-/${lng},${lat},${encodeURIComponent(name)},,ADDRESS`;
}
