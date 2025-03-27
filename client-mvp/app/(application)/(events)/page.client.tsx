'use client';

import { PropsWithChildren, useEffect } from 'react';
import { parseAsBoolean, useQueryState } from 'nuqs';

import { useRouter } from 'next/navigation';

export default function Client(props: PropsWithChildren) {
  const { children } = props;
  const [onboarding] = useQueryState('onboarding', parseAsBoolean);
  const router = useRouter();

  useEffect(() => {
    if (onboarding) {
      router.push('/onboarding/notifications');
    }
  }, [router, onboarding]);

  return <>{children}</>;
}
