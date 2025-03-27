import Image from 'next/image';
import styles from './styles.module.sass';

export function TeamChoose() {
  return (
    <label className={styles.base}>
      <Image src="" height={74} width={74} alt="" />
      <span className={styles.heading}>Team Name</span>
      <input type="radio" name="team" className={styles.input} />
    </label>
  );
}
