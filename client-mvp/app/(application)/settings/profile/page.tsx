import MainPage from '../page';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <MainPage />
    </Suspense>
  );
}
