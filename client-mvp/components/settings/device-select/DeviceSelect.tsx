import React from 'react';
import { Select } from '@/shared/dsm';
import './styles.module.sass';

type DeviceSelectProps = {
  activeDeviceId: string;
  items: { value: string; label: string }[];
  name: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function DeviceSelect({ activeDeviceId, items, name, id, onChange }: DeviceSelectProps) {
  return (
    <fieldset className='device-select'>
      <label htmlFor={id}>{name}</label>
      <Select
        onChange={onChange}
        defaultValue={activeDeviceId}
        options={items.map(({ value, label }) => ({ value, label }))}
        id={id}
      />
    </fieldset>
  );
}