'use client';

import { Button } from '@/dsm';
import { TeamChoose } from '@/components/01-cards';
import styles from './styles.module.sass';

type ChatChooseProps = {
  onDismiss?: () => void;
  onClose?: () => void;
};

export function ChatChoose(props: ChatChooseProps) {
  const { onDismiss } = props;

  return (
    <section className={styles.base}>
      {onDismiss && (
        <Button intent="tertiary" onClick={onDismiss} icon="arrowBack" />
      )}
      <header className={styles.header}>
        <h3 className={styles.subheading}>Team vs Team</h3>
        <h2 className={styles.heading}>Choose Side</h2>
      </header>
      <div className={styles.teams}>
        <TeamChoose />
        <TeamChoose />
      </div>
      <div className={styles.actions}>
        <Button href="/chat/create" intent="tertiary">
          Create Chat
        </Button>
        <Button href="/chat/1?team=1">Enter the Chat</Button>
      </div>
    </section>
  );
}
