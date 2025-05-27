import { cva } from 'cva';
import styles from './styles.module.sass';
import Image from 'next/image';

interface TeamLocationProps {
  isHome: boolean;
  className?: string;
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

export const TeamLocation: React.FC<TeamLocationProps> = ({ 
  isHome, 
  className, 
}) => {
  return (
    <div className={containerStyle({ isHome, className })}>
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