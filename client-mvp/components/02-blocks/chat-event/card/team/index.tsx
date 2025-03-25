import { Icons } from '@/dsm';
import styles from './styles.module.sass';

export function Team() {
  const Icon = Icons['edit'];

  return (
    <div className={styles.base}>
      <h3 className={styles.heading}>Team Name</h3>
      <div className={styles.location}>
        <Icon width={12} height={12} />
        Home
      </div>
    </div>
  );
}
