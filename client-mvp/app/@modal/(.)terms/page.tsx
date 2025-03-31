import { Modal } from '@/shared/dsm';
import { PageModal } from '@/components';
import Terms from '@/markdown/terms.mdx';

export default function Page() {
  return (
    <Modal>
      <PageModal title="Terms of Use" meta="Last Updated: 02.10.24">
        <Terms />
      </PageModal>
    </Modal>
  );
}
