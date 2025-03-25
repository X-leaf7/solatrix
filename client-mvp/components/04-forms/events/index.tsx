'use client';

import { Input, Select } from '@/dsm';

import styles from './styles.module.sass';
import { useQueryState } from 'nuqs';

const options = [
  {
    label: 'Option 1',
    value: 'Option 1',
  },
];

export function FormEvents() {
  const [filter, setFilter] = useQueryState('filter');
  const [query, setQuery] = useQueryState('query');

  return (
    <form className={styles.base}>
      <Select
        name="filter"
        options={options}
        value={filter || ''}
        placeholder="Filter by"
        onChange={(e) => setFilter(e.target.value)}
      />
      <Input
        name="query"
        value={query || ''}
        placeholder="Search event"
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
