import { PropsWithChildren } from 'react';
import styles from './styles.module.sass';

type ActionProps = {
  heading: string;
  content?: string;
};

export function Action(props: PropsWithChildren<ActionProps>) {
  const { heading, content, children } = props;

  return (
    <div className={styles.base}>
      <div className={styles.box}>
        <h3 className={styles.heading}>{heading}</h3>
        {content && (
          <div className={styles.content}>
            <p>{content}</p>
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
