import { Modal } from '@/01-dsm';
import { PageModal } from '@/02-components';
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
