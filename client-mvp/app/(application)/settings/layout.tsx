import LayoutClient from './layout.client';
import { PropsWithChildren } from 'react';

export default function Layout(props: PropsWithChildren) {
  const { children } = props;

  return <LayoutClient>{children}</LayoutClient>;
}
