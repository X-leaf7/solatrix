import { League as LeageType } from '@/data/types';
import styles from './styles.module.sass';

export function League({ league }: { league: LeageType }) {
  return (
    <div className={styles.base}>
      <div className={styles.heading}>{league.short_name || league.name}</div>
    </div>
  );
}
