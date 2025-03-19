import { PropsWithChildren } from 'react';
import styles from './layout.module.sass';

export default function Layout(props: PropsWithChildren) {
  const { children } = props;

  return <div className={styles.base}>{children}</div>;
}
