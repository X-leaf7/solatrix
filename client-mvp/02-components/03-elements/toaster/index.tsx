import { Toaster as Sonner } from 'sonner';
import styles from './styles.module.sass';

export function Toaster() {
  return (
    <Sonner
      toastOptions={{
        closeButton: true,
        classNames: {
          toast: styles.toast,
          title: styles.title,
          description: styles.description,
        },
      }}
    />
  );
}
