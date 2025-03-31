import styles from './styles.module.sass';

export type TeamProps = {
  name: string;
};

export function Team(props: TeamProps) {
  const { name } = props;

  return (
    <div className={styles.base}>
      <div className={styles.heading}>{name}</div>
    </div>
  );
}
