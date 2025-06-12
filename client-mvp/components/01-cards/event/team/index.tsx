import { Icons } from '@/shared/dsm';
import Image from 'next/image';
import { Team as TeamType } from '@/data/types/team';
import styles from './styles.module.sass';

type TeamProps = {
  team: TeamType;
  type?: 'home' | 'away';
};

export function Team({ team, type }: TeamProps) {
  const icon = type === 'home' ? 'home' : 'globe';
  const Icon = Icons[icon];

  let cleanLogo = null;
  try {
    cleanLogo = new URL(team.logo).pathname;
  } catch {
    // use null default
  }

  return (
    <div className={styles.base}>
      {cleanLogo ? (
        <Image src={cleanLogo} width={64} height={64} alt={team.name} />
      ) : (
        <Icon width={64} height={64} />
      )}
      <h3 className={styles.heading}>{team.name}</h3>
      <div className={styles.location}>
        <Icon width={12} height={12} />
      </div>
    </div>
  );
}
