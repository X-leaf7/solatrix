'use client';

import { parseAsBoolean, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Form from 'next/form';
import { cx } from 'cva';
import { IUser } from '@/shared/types';
import {
  Button,
  Input,
  InputField,
  ControlledToggle as Toggle,
} from '@/shared/dsm';

import styles from './styles.module.sass';

interface IFormProfileProps {
  user: IUser | null
}

type IFormData = Omit<IUser, 'avatar'>;

export const FormProfile: React.FC<IFormProfileProps> = ({ user }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<IFormData>({
    username: user?.username ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
  });

  const [editing, setEditing] = useQueryState(
    'editing',
    parseAsBoolean.withDefault(false),
  );

  useEffect(() => {
    // Sync form data when user changes
    setFormData({
      username: user?.username ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
    });
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEditing(false);

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      // Update was successful
      setEditing(false);

      // Show success message or redirect
      router.push('/settings/verification-sent');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }

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
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.full}>
          <InputField label="Username">
            <Input
              name="username"
              required
              disabled={!editing}
              value={formData.username}
              onChange={handleChange}
            />
          </InputField>
        </div>
        <div>
          <InputField label="First name">
            <Input
              name="firstName"
              required
              disabled={!editing}
              value={formData.firstName}
              onChange={handleChange}
            />
          </InputField>
        </div>
        <div>
          <InputField label="Last name">
            <Input
              name="lastName"
              required
              disabled={!editing}
              value={formData.lastName}
              onChange={handleChange}
            />
          </InputField>
        </div>
        <div className={styles.full}>
          <InputField label="Email">
            <Input
              type="email"
              name="email"
              required
              disabled={!editing}
              value={formData.email}
              onChange={handleChange}
            />
          </InputField>
        </div>
        <div className={cx(styles.full, styles.action)}>
          <Button
            disabled={!editing || isSubmitting}
            type="submit"
            loading={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}
