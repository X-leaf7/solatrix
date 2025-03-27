import {
  PropsWithChildren,
  ReactElement,
  cloneElement,
  isValidElement,
} from 'react';

import { Input } from '../input';
import { InputOTP } from '../input-otp';
import { Select } from '../select';
import slugify from 'slugify';
import styles from './styles.module.sass';

type AllowedChild = ReactElement<
  typeof Input | typeof Select | typeof InputOTP
>;

type InputFieldProps = {
  label: string;
  text?: string;
  children: AllowedChild;
};

export function InputField(props: PropsWithChildren<InputFieldProps>) {
  const { label, children, text } = props;
  let isRequired = false;

  const id = slugify(label);

  if (isValidElement(children)) {
    isRequired = 'required' in children.props ? !!children.props.required : false;
  }

  const childWithId =
    children && isValidElement(children)
      ? cloneElement(children as ReactElement<any>, { id })
      : children;

  return (
    <div className={styles.base}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {isRequired && '*'}
      </label>
      <div className={styles.control}>{childWithId}</div>
      {text && <div className={styles.content}>{text}</div>}
    </div>
  );
}
