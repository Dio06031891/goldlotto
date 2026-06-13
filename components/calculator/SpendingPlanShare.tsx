'use client';

import { useCallback, useState } from 'react';
import { toPng } from 'html-to-image';
import type { SpendingPlan } from '@/lib/types/spending';

type Props = {
  plan: SpendingPlan;
  captureTargetId: string;
  disabled?: boolean;
};

function safeFilename(name: string): string {
  const cleaned = name.replace(/[<>:"/\\|?*\n\r]/g, '_').trim();
  return cleaned.slice(0, 60) || '사용계획';
}

function isIosLike(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/** PC: 다운로드 / iOS: 새 탭에서 열어 「사진에 저장」 */
async function savePngBlob(blob: Blob, filename: string): Promise<'download' | 'opened'> {
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();

    if (isIosLike()) {
      const tab = window.open(url, '_blank', 'noopener,noreferrer');
      if (tab) return 'opened';
    }
    return 'download';
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 15_000);
  }
}

export function SpendingPlanShare({ plan, captureTargetId, disabled }: Props) {
  const [busy, setBusy] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  const capturePngBlob = useCallback(async (): Promise<Blob> => {
    const el = document.getElementById(captureTargetId);
    if (!el) throw new Error('CAPTURE_TARGET_NOT_FOUND');
    const dataUrl = await toPng(el, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });
    const res = await fetch(dataUrl);
    return await res.blob();
  }, [captureTargetId]);

  const savePhoto = async () => {
    setBusy(true);
    setIosHint(false);
    try {
      const blob = await capturePngBlob();
      const filename = `${safeFilename(plan.name)}-사용계획.png`;
      const mode = await savePngBlob(blob, filename);
      if (mode === 'opened') setIosHint(true);
    } catch {
      alert('사진 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <button
        type="button"
        disabled={busy || disabled}
        onClick={() => void savePhoto()}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-50"
      >
        {busy ? '저장 중…' : '사진으로 저장하기'}
      </button>
      {iosHint && (
        <p className="mt-2 text-center text-xs leading-relaxed text-muted">
          새 탭에 열린 이미지를 <strong className="text-ink">길게 눌러</strong> 「사진에
          저장」 또는 「이미지 저장」을 선택하세요.
        </p>
      )}
      <p className="mt-2 text-center text-xs text-muted">
        차트와 항목·비율이 포함된 이미지가 갤러리(PC는 다운로드 폴더)에 저장됩니다.
      </p>
    </div>
  );
}
