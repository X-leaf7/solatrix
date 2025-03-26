import React from 'react';
import './styles.module.sass';

type SpacerProps = {
  size: 'sm' | 'md' | 'lg' | 'xl';
};

export default function Spacer({ size }: SpacerProps) {
  return <div className={`spacer ${size}`}></div>;
}
