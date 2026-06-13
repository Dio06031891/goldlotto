'use client';

import { useId, type SVGProps } from 'react';

type GoldLottoLogoProps = Omit<SVGProps<SVGSVGElement>, 'viewBox'> & {
  /** 접근성용 라벨 */
  'aria-label'?: string;
};

/**
 * 황금 로또볼 3개(각각 7) — 브랜드 마크 (SVG).
 */
export function GoldLottoLogo({
  className,
  'aria-label': ariaLabel = '황금로또',
  ...rest
}: GoldLottoLogoProps) {
  const rid = useId().replace(/:/g, '');
  const p = `gl${rid}`;

  const ballCenters = [26, 48, 70] as const;
  const cy = 50;
  const r = 17;

  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={ariaLabel}
      role="img"
      {...rest}
    >
      <title>{ariaLabel}</title>
      <defs>
        <radialGradient
          id={`${p}-ball`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0 -4) rotate(90) scale(18 18)"
        >
          <stop stopColor="#fffef5" offset="0%" />
          <stop stopColor="#fde047" offset="42%" />
          <stop stopColor="#d97706" offset="88%" />
          <stop stopColor="#78350f" offset="100%" />
        </radialGradient>
        <radialGradient
          id={`${p}-spec`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-5 -7) rotate(48) scale(10 12)"
        >
          <stop stopColor="#ffffff" stopOpacity="0.9" offset="0%" />
          <stop stopColor="#ffffff" stopOpacity="0" offset="65%" />
        </radialGradient>
      </defs>

      {/* 은은한 바닥 글로우 */}
      <ellipse cx="48" cy="76" rx="38" ry="10" fill="#fbbf24" fillOpacity="0.2" />

      {ballCenters.map((cx, i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          <circle r={r + 0.5} fill="#0f172a" fillOpacity="0.12" cy="2" />
          <circle r={r} fill={`url(#${p}-ball)`} stroke="#92400e" strokeWidth="0.65" />
          <circle r={r} fill={`url(#${p}-spec)`} />
          <circle
            r={r}
            fill="none"
            stroke="#fffbeb"
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
          <text
            x="0"
            y="1"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#0f172a"
            fontSize="19"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
            style={{ letterSpacing: '-0.04em' }}
          >
            7
          </text>
        </g>
      ))}
    </svg>
  );
}
