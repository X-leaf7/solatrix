'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { Suspense } from 'react'

import { EmailChanged } from '@/components';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Inner() {
  const router = useRouter();
  const [email] = useQueryState('email', parseAsString);

  useEffect(() => {
    router.push(`/email-changed?email=${email}`);
  }, [email, router]);

  return <EmailChanged />;
}

export default function Page() {
  <Suspense>
    <Inner />
  </Suspense>
}
