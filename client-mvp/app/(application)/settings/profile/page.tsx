import { SettingsMainPage } from '@/features/settings/pages';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <SettingsMainPage />
    </Suspense>
  );
}
