import { ChatCreate } from '@/features/chat/pages';
import { Modal } from '@/shared/dsm';

export default function Page() {
  return (
    <Modal>
      <ChatCreate />
    </Modal>
  );
}
