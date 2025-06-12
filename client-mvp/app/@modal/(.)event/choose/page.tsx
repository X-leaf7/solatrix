import { Modal } from '@/shared/dsm';
import { EventChoose } from '@/features/event/pages';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Modal>
      <Suspense>
        <EventChoose />
      </Suspense>
    </Modal>
  );
}
