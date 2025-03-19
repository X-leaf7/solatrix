import Client from '../page.client';
import { Events } from '@/02-components';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <Client>
        <Events eventTiming="upcoming" token={null} />
      </Client>
    </Suspense>
  );
}
