import { SettingsLayout } from '@/features/settings/layout';
import { PropsWithChildren } from 'react';

export default function Layout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <SettingsLayout>
      {children}
    </SettingsLayout>
  );
}
