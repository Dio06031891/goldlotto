'use client';

import { useEffect } from 'react';
import { adSlots, isAdSenseEnabled, type AdSlotKey } from '@/lib/utils/ad-slots';
import { env } from '@/lib/utils/env';

type Props = {
  /** ad-slots 키 또는 직접 슬롯 ID 문자열 */
  slot: AdSlotKey | string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: boolean;
};

function resolveSlotId(slot: AdSlotKey | string): string {
  if (slot in adSlots) return adSlots[slot as AdSlotKey];
  return slot;
}

export function AdSenseSlot({
  slot,
  format = 'auto',
  className = '',
  label = true,
}: Props) {
  const clientId = env.ADSENSE_CLIENT_ID?.trim();
  const slotId = resolveSlotId(slot).trim();
  const enabled = isAdSenseEnabled() && Boolean(clientId) && Boolean(slotId);

  useEffect(() => {
    if (!enabled) return;
    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, [enabled, slotId]);

  if (!enabled) return null;

  return (
    <aside className={`my-8 overflow-hidden ${className}`} aria-label="광고">
      {label && (
        <p className="mb-1 text-center text-[10px] font-medium uppercase tracking-wide text-slate-400">
          광고
        </p>
      )}
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
