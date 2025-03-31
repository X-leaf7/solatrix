import { Icons } from '@/shared/dsm';
import styles from './styles.module.sass';

export function Location({ name }: { name: string }) {
  const Icon = Icons['location'];

  return (
    <div className={styles.base}>
      <Icon width={12} height={12} />
      <div className={styles.label}>{name}</div>
    </div>
  );
}
