import { useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (_: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // In NextJS SSR window is undefined. We need to check it first
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : initialValue;
      }

      return initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? (value(storedValue) as T) : value;
      setStoredValue(valueToStore);

      // In NextJS SSR window is undefined. We need to check it first
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeValue = () => {
    try {
      // In NextJS SSR window is undefined. We need to check it first
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue, removeValue];
}
