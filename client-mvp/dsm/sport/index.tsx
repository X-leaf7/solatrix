import { Sport as SportType } from '@/data/types';
import { Icons } from '../icons';
import styles from './styles.module.sass';

type IconKeys = keyof typeof Icons;

export function Sport({ sport }: { sport: SportType }) {

  const icon = sport.name.toLowerCase() as IconKeys;

  const Icon = Icons[icon] || Icons["globe"];

  return (
    <div className={styles.base}>
      <Icon />
      <div className={styles.heading}>{sport.name}</div>
    </div>
  );
}
