import { PropsWithChildren } from 'react';
import styles from './styles.module.sass';

export function Content(props: PropsWithChildren) {
  const { children } = props;
  return <div className={styles.base}>{children}</div>;
}
