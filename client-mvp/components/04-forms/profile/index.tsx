'use client';

import {
  Button,
  Input,
  InputField,
  ControlledToggle as Toggle,
} from '@/shared/dsm';
import { parseAsBoolean, useQueryState } from 'nuqs';

import Form from 'next/form';
import { cx } from 'cva';
import styles from './styles.module.sass';
import { useRouter } from 'next/navigation';

export function FormProfile() {
  const router = useRouter();

  const [editing, setEditing] = useQueryState(
    'editing',
    parseAsBoolean.withDefault(false),
  );

  function handleSubmit() {
    setEditing(false);

    setTimeout(() => {
      router.push('/settings/verification-sent');
    }, 200);
  }

  return (
    <div className={styles.base}>
      <div className={styles.header}>
        <h3>Basic Details</h3>
        <Toggle state={editing} setState={setEditing} />
      </div>
      <Form action={handleSubmit} className={styles.form}>
        <div className={styles.full}>
          <InputField label="Username">
            <Input required disabled={!editing} />
          </InputField>
        </div>
        <div>
          <InputField label="First name">
            <Input required disabled={!editing} />
          </InputField>
        </div>
        <div>
          <InputField label="Last name">
            <Input required disabled={!editing} />
          </InputField>
        </div>
        <div className={styles.full}>
          <InputField label="Email">
            <Input type="email" required disabled={!editing} />
          </InputField>
        </div>
        <div className={cx(styles.full, styles.action)}>
          <Button disabled={!editing} type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
