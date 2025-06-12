'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseAsBoolean, useQueryState } from 'nuqs';

import { Events } from '../components';
import { EventTiming } from '@/data';
import { EventsProvider } from '../provider';

interface EventDashboardProps {
  eventTiming: EventTiming
}

export const EventDashboard: React.FC<EventDashboardProps> = ({ eventTiming }) => {
  const [onboarding] = useQueryState('onboarding', parseAsBoolean);
  const router = useRouter();

  useEffect(() => {
    if (onboarding) {
      router.push('/onboarding/notifications');
    }
  }, [router, onboarding])

  return (
    <EventsProvider>
      <Events eventTiming={eventTiming} />
    </EventsProvider>
  )
}
