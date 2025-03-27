import { Progress, ProgressProps } from '@/dsm';

type ProfileProgressProps = {
  label: ProgressProps['label'];
};

export function ProfileProgress(props: ProfileProgressProps) {
  const { label } = props;
  const progress = 50;

  return <Progress label={label} progress={progress} />;
}
