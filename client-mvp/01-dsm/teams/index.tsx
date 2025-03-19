import { Team, type TeamProps } from '../team';
import styles from './styles.module.sass';

type TeamsProps = {
  teams: TeamProps[];
};

export function Teams(props: TeamsProps) {
  const { teams } = props;

  return (
    <div className={styles.base}>
      {teams.map((team) => (
        <Team key={team.name} {...team} />
      ))}
    </div>
  );
}
