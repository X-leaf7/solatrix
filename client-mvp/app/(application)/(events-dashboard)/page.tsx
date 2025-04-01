import Client from './page.client';
import { Events } from '@/components';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <Client>
        <Events eventTiming="live" />
      </Client>
    </Suspense>
  );
}
