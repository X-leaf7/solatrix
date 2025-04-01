'use client';

import { Button, DragAndDrop, Icons } from '@/shared/dsm';
import { parseAsInteger, useQueryState } from 'nuqs';

import Image from 'next/image';
import { cx } from 'cva';
import styles from './styles.module.sass';

type AvatarUploaderProps = {
  onDismiss?: () => void;
};

export function AvatarUploader(props: AvatarUploaderProps) {
  const { onDismiss } = props;
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(1));

  function advanceStep() {
    setStep((step) => step + 1);
  }

  return (
    <div className={styles.base}>
      <div className={styles.box}>
        {step === 1 && <AvatarUploaderStepOne />}
        {step === 2 && <AvatarUploaderStepTwo />}
      </div>
      <div className={styles.actions}>
        {onDismiss && step === 1 && (
          <Button onClick={onDismiss} intent="tertiary">
            Cancel
          </Button>
        )}
        {step === 1 && <Button onClick={advanceStep}>Save</Button>}
        {step === 2 && onDismiss && <Button onClick={onDismiss}>Done</Button>}
      </div>
    </div>
  );
}

function AvatarUploaderStepOne() {
  const Download = Icons['download'];

  function handleDrop() {
    console.log('wut');
  }

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.heading}>Change avatar</h2>
      </div>
      <DragAndDrop handleDrop={handleDrop}>
        {({ isDragging }) => (
          <form className={cx(styles.form, isDragging && styles.dragging)}>
            <Download width={56} height={56} />
            <input
              className={styles.file}
              type="file"
              name=""
              id="file-avatar"
            />
            <p className={styles.text}>Upload or drag and drop a JPG or PNG</p>
            <label htmlFor="file-avatar" className={styles.label}>
              Browse
            </label>
          </form>
        )}
      </DragAndDrop>
    </>
  );
}

function AvatarUploaderStepTwo() {
  return (
    <div>
      <figure className={styles.image}>
        <Image
          src="/images/illustration-success.png"
          width={160}
          height={160}
          alt="Success State"
        />
      </figure>
      <div className={styles.header}>
        <h2 className={styles.heading}>Your avatar has been changed</h2>
      </div>
      <p>Looking good!</p>
    </div>
  );
}
