import { redirect } from 'next/navigation';
import { getCachedLatestDrwNo } from '@/lib/lotto/cached-latest-no';

export default async function DrawLatestRedirect() {
  const latest = await getCachedLatestDrwNo();
  if (!latest) redirect('/');
  redirect(`/draw/${latest}`);
}
