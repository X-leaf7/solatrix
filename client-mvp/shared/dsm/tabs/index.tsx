import styles from './styles.module.sass';

import { Tab, type TabProps } from './tab';

type TabsProps = {
  tabs: TabProps[];
  activeIndex: number;
};

export function Tabs(props: TabsProps) {
  const { tabs, activeIndex = 0 } = props;

  return (
    <div className={styles.base}>
      {tabs.map((tab, index) => (
        <Tab active={activeIndex === index} key={`tab-${index}`} {...tab} />
      ))}
    </div>
  );
}
