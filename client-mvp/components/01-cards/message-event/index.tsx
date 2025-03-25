import { VariantProps, cva } from 'cva';

import { Avatar } from '@/dsm';
import styles from './styles.module.sass';

const message = cva(styles.base, {
  variants: {
    current: {
      true: styles.current,
    },
  },
});

type MessageEventProps = VariantProps<typeof message> & {
  profile_image?: string;
  text: string;
  is_current_user?: boolean;
};

export function MessageEvent(props: MessageEventProps) {
  const { text, is_current_user = false } = props;

  const style = message({ current: is_current_user });

  return (
    <li className={style}>
      <div className={styles.avatar}>
        <Avatar size="small" />
      </div>
      <div className={styles.content}>
        <p>{text}</p>
      </div>
    </li>
  );
}
