import { PropsWithChildren } from 'react';
import styles from './layout.module.sass';

export default function Layout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div>
      <h2 className={styles.heading}>Danger Zone</h2>
      <div className={styles.grid}>{children}</div>
    </div>
  );
}
