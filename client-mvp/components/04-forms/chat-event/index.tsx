import { Button, Input } from '@/dsm';

import styles from './styles.module.sass';

export function FormChatEvent() {
  return (
    <form className={styles.base}>
      <Input fullWidth />
      <Button icon="paperPlane" />
    </form>
  );
}
