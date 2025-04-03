import { DividerGradient } from '@/shared/dsm';
import { Score } from './score';
import { Team } from './team';
import { Time } from './time';
import styles from './styles.module.sass';

export function ChatEventCard() {
  return (
    <div className={styles.base}>
      <div className={styles.grid}>
        <div>
          <Team />
        </div>
        <div className={styles.main}>
          <Score />
        </div>
        <div>
          <Team />
        </div>
      </div>
      <div className={styles.grid}>
        <div></div>
        <div className={styles.time}>
          <DividerGradient color="#888" />
          <Time />
        </div>
        <div></div>
      </div>
    </div>
  );
}
