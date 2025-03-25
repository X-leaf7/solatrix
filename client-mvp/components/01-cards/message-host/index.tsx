import { Avatar } from '@/dsm';
import { User } from '@/data/types';
import styles from './styles.module.sass';

type MessageHostProps = Pick<
  User,
  'profile_image' | 'first_name' | 'last_name'
> & {
  id: string;
  text: string;
};

export function MessageHost(props: MessageHostProps) {
  const { first_name, last_name, text } = props;
  const name = `${first_name} ${last_name}`;

  return (
    <article className={styles.base}>
      <header className={styles.header}>
        <Avatar size="small" />
        <h3 className={styles.heading}>{name}</h3>
      </header>
      <div className={styles.content}>
        <p>{text}</p>
      </div>
    </article>
  );
}
