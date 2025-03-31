import { VariantProps, cva } from 'cva';

import Image from 'next/image';
import styles from './styles.module.sass';

const avatar = cva(styles.base, {
  variants: {
    size: {
      large: styles.large,
      medium: styles.medium,
      small: styles.small,
    },
  },
});

type AvatarProps = VariantProps<typeof avatar> & {
  src?: string;
};

export function Avatar(props: AvatarProps) {
  const { src = '/images/avatar-default.png', size = 'large' } = props;

  return (
    <figure className={avatar({ size })}>
      <Image src={src} width={250} height={250} alt="" />
    </figure>
  );
}
