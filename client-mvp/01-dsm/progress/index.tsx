import styles from './styles.module.sass';

export type ProgressProps = {
  label: string;
  progress: number;
};

export function Progress(props: ProgressProps) {
  const { label, progress = 0 } = props;

  return (
    <div className={styles.base}>
      <div className={styles.label}>{label}</div>
      <div className={styles.bar}>
        <div
          className={styles.progress}
          style={{ inlineSize: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
