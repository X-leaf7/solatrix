import { AvatarUploader } from '@/features/settings/components';
import { UserProvider } from '@/features/settings/providers';
import { Modal } from '@/shared/dsm';

export default function Page() {
  return (
    <Modal size='small'>
      <UserProvider>
        <AvatarUploader />
      </UserProvider>
    </Modal>
  );
}
