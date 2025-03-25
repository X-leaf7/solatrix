import { SignOut } from '@/components';
import styles from './page.module.sass';

export default function Page() {
  return (
    <div className={styles.base}>
      <SignOut />
    </div>
  );
}
