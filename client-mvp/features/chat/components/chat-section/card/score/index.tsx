import styles from './styles.module.sass';

type ScoreProps = {
  home?: number;
  away?: number;
};

export function Score(props: ScoreProps) {
  const { home = 0, away = 0 } = props;

  return (
    <div className={styles.base}>
      {home} : {away}
    </div>
  );
}
