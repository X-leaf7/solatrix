'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { EmailChanged } from '@/components';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [email] = useQueryState('email', parseAsString);

  useEffect(() => {
    router.push(`/email-changed?email=${email}`);
  }, [email, router]);

  return <EmailChanged />;
}
