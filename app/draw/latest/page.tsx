import { redirect } from 'next/navigation';
import { getLatestDrwNoFromDisk } from '@/lib/lotto/latest-draw-hint';
import { isNextProductionBuild } from '@/lib/lotto/is-production-build';
import { getCachedLatestDrwNo } from '@/lib/lotto/cached-latest-no';

export default async function DrawLatestRedirect() {
  const latest = isNextProductionBuild()
    ? getLatestDrwNoFromDisk()
    : await getCachedLatestDrwNo();
  if (!latest) redirect('/');
  redirect(`/draw/${latest}`);
}
