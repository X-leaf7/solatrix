import { Modal } from '@/shared/dsm';
import { PageModal } from '@/components';
import Privacy from '@/markdown/privacy.mdx';

export default function Page() {
  return (
    <Modal>
      <PageModal title="Privacy Policy" meta="Last Updated: 02.10.24">
        <Privacy />
      </PageModal>
    </Modal>
  );
}
