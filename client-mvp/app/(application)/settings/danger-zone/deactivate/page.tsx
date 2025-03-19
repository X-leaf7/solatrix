import { Deactivate } from '@/02-components';
import styles from './page.module.sass';

export default function Page() {
  return (
    <div className={styles.base}>
      <Deactivate />
    </div>
  );
}
