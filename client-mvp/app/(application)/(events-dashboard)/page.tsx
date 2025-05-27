import { EventDashboard } from '@/features/event-dashboard/pages';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={(<></>)}>
      <EventDashboard eventTiming="live" />
    </Suspense>
  );
}
