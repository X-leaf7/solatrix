import { PropsWithChildren } from 'react';

export type BaseProps = {
  height?: number;
  width?: number;
};

export function Base(props: PropsWithChildren<BaseProps>) {
  const { children, height = 16, width = 16 } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}
