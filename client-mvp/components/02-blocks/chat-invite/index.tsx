'use client';

import { Action, Button, ControlledToggle } from '@/dsm';
import { parseAsBoolean, useQueryState } from 'nuqs';

import Image from 'next/image';
import styles from './styles.module.sass';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';

export function ChatInvite() {
  const [, copy] = useCopyToClipboard();

  const [stream, setStream] = useQueryState(
    'stream',
    parseAsBoolean.withDefault(true),
  );

  function handleCopy() {
    copy('https://apple.com');
    toast('Copied the invite link.');
  }

  return (
    <section className={styles.base}>
      <figure className={styles.image}>
        <Image
          src="/images/illustration-error.png"
          width={120}
          height={120}
          alt="Error State"
        />
      </figure>
      <header className={styles.header}>
        <h2 className={styles.heading}>Invite Guests?</h2>
        <div className={styles.content}>
          <p>Host up-to 24 guests in a private chat for the match</p>
        </div>
      </header>
      <div className={styles.group}>
        <Action heading="Access link" content="Available in Settings > Events">
          <Button
            intent="secondary"
            size="medium"
            icon="link"
            onClick={handleCopy}
          >
            Copy Link
          </Button>
        </Action>
        <Action
          heading="Video Stream"
          content="As the host, you can live stream to the fans in the chat. This turns
          it on when you enter. You can turn if on and off in the chat at
          anytime."
        >
          <ControlledToggle size="large" state={stream} setState={setStream} />
        </Action>
      </div>
      <div className={styles.fineprint}>
        <p></p>
      </div>
      <div className={styles.actions}>
        <Button href="/settings" intent="tertiary">
          Go to Settings
        </Button>
        <Button href={`/chat/1?stream=${stream}`}>Enter Chat</Button>
      </div>
    </section>
  );
}
