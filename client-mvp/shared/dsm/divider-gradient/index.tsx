import { PropsWithChildren, useId } from 'react';

import styles from './styles.module.sass';

type DividerGradientProps = {
  type?: 'top' | 'bottom';
  color?: string;
};

export function DividerGradient(props: DividerGradientProps) {
  const { type = 'bottom', ...rest } = props;
  const id = useId();

  const Gradient = type === 'bottom' ? BottomGradient : TopGradient;

  return <Gradient id={id} {...rest} />;
}

type GradientProps = {
  id: string;
  color?: string;
};

type BaseProps = {
  width: number;
  height: number;
};

function Base(props: PropsWithChildren<BaseProps>) {
  const { children, width, height } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={styles.base}
    >
      {children}
    </svg>
  );
}

function BottomGradient(props: GradientProps) {
  const { id, color = '#45DC65' } = props;

  return (
    <Base height={29} width={302}>
      <path
        d="M302.333 28H250.069C243.651 28 237.623 24.9203 233.862 19.72L226.312 9.27999C222.552 4.0797 216.524 1 210.106 1H152.633H107.516C102.231 1 97.1604 3.09212 93.4129 6.81917L77.9668 22.1808C74.2193 25.9079 69.1488 28 63.8635 28H0.333008"
        stroke={`url(#${id})`}
        height="auto"
        width="100%"
      />
      <defs>
        <linearGradient
          id={id}
          x1="15.7126"
          y1="28"
          x2="288.348"
          y2="27.0934"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.511667" stopColor={color} />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </Base>
  );
}

function TopGradient(props: GradientProps) {
  const { id, color = '#45DC65' } = props;
  return (
    <Base height={29} width={233}>
      <path
        d="M232.478 1H194.364C188.288 1 182.541 3.76226 178.746 8.50724L169.159 20.4928C165.363 25.2377 159.617 28 153.54 28H117.405H83.6453C78.3246 28 73.2231 25.8799 69.4697 22.1086L54.3244 6.89138C50.571 3.12016 45.4695 1 40.1488 1H0.333008"
        stroke={`url(#${id})`}
        height="auto"
        width="100%"
      />
      <defs>
        <linearGradient
          id={id}
          x1="-11.667"
          y1="0.999998"
          x2="256.33"
          y2="1.92419"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.511667" stopColor={color} />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </Base>
  );
}
