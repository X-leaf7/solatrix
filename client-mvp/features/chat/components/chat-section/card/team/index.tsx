import { cva } from 'cva';
import Image from 'next/image';

import styles from './styles.module.sass';

interface TeamProps {
  isHome: boolean;
  className?: string;
  teamName?: string;
}

const containerStyle = cva(styles.base, {
  variants: {
    isHome: {
      true: styles.home,
      false: styles.away,
    }
  },
  defaultVariants: {
    isHome: true
  }
})

export const Team: React.FC<TeamProps> = ({ 
  isHome, 
  className, 
  teamName 
}) => {
  return (
    <div className={containerStyle({ isHome, className })}>
      <h3 className={styles.heading}>{teamName}</h3>
      <div className={styles.location}>
        {isHome ? (
          <Image
            src='/images/chat/home.png'
            width={12}
            height={12}
            alt='Home team icon image'
          />
        ) : (
          <Image
            src='/images/chat/globe.png'
            width={12}
            height={12}
            alt='Away team icon image'
          />
        )}
        {isHome ? 'Home' : 'Away'}
      </div>
    </div>
  );
}