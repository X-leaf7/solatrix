import { Suspense } from 'react';

import { SignIn } from '@/features/auth';

export default function Page() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  )
}
