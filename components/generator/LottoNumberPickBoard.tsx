'use client';

import { lottoBallColor } from '@/lib/lotto/lotto-ball-colors';

const MAX_SELECT = 6;

type Props = {
  selected: number[];
  onChange: (nums: number[]) => void;
  disabled?: boolean;
};

export function LottoNumberPickBoard({ selected, onChange, disabled }: Props) {
  const sorted = [...selected].sort((a, b) => a - b);

  const toggle = (n: number) => {
    if (disabled) return;
    if (selected.includes(n)) {
      onChange(selected.filter((x) => x !== n));
      return;
    }
    if (selected.length >= MAX_SELECT) return;
    onChange([...selected, n]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink">
          번호 선택{' '}
          <span className="font-bold text-brand">
            {selected.length}/{MAX_SELECT}
          </span>
        </p>
        <p className="text-xs text-muted">탭하여 선택 · 최대 6개 (구매 화면과 동일)</p>
      </div>

      {sorted.length > 0 && (
        <div
          className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-xl border-2 border-brand/30 bg-blue-50/50 px-3 py-2"
          aria-label="선택한 번호"
        >
          {sorted.map((n) => (
            <button
              key={n}
              type="button"
              disabled={disabled}
              onClick={() => toggle(n)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-white shadow ring-2 ring-white transition hover:scale-105"
              style={{ backgroundColor: lottoBallColor(n) }}
              aria-label={`${n}번 선택 해제`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      <div
        className="grid grid-cols-7 gap-2 sm:gap-2.5"
        role="group"
        aria-label="1부터 45까지 로또 번호"
      >
        {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
          const isOn = selected.includes(n);
          const full = !isOn && selected.length >= MAX_SELECT;
          return (
            <button
              key={n}
              type="button"
              disabled={disabled || full}
              aria-pressed={isOn}
              onClick={() => toggle(n)}
              className={`flex aspect-square min-h-[40px] w-full items-center justify-center rounded-full text-sm font-bold transition sm:min-h-[44px] sm:text-base ${
                isOn
                  ? 'scale-105 text-white shadow-lg ring-2 ring-brand ring-offset-2'
                  : full
                    ? 'cursor-not-allowed bg-slate-100 text-slate-300'
                    : 'bg-white text-ink shadow-sm ring-1 ring-slate-200 hover:ring-brand/50'
              }`}
              style={isOn ? { backgroundColor: lottoBallColor(n) } : undefined}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const LOTTO_PICK_MAX = MAX_SELECT;
