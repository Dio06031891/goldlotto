import { lottoBallColor } from '@/lib/lotto/lotto-ball-colors';

type LottoBallProps = {
  num: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClass = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-11 w-11 text-base',
  lg: 'h-12 w-12 text-lg sm:h-14 sm:w-14 sm:text-xl',
} as const;

export function LottoBall({ num, size = 'md', className = '' }: LottoBallProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow-md ring-2 ring-white/40 ${sizeClass[size]} ${className}`}
      style={{ backgroundColor: lottoBallColor(num) }}
      aria-label={`번호 ${num}`}
    >
      {num}
    </span>
  );
}
