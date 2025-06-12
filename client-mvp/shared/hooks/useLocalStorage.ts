'use client'

import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, defaultValue: T, saveSettings = false): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      let storedValue
      if (typeof window !== 'undefined') {
        storedValue = localStorage.getItem(key);
      }
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.log(error)
      return defaultValue;
    }
  });

  useEffect(() => {
    if (saveSettings || key === 'rememberSettings') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  }, [value, key, saveSettings]);

  return [value, setValue];
}

export default useLocalStorage;
