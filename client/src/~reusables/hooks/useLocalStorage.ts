import { useState } from "react";
import { Maybe } from "../utils/types";

export const useLocalStorage = <T>(key: string, initialValue: Maybe<T>) => {
  const [storedValue, setStoredValue] = useState<Maybe<T>>(() => {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : initialValue;
  });

  const setValue = (value: Maybe<T>) => {
    setStoredValue(value);
    localStorage.setItem("key", JSON.stringify(value));
  };

  return [storedValue, setValue];
};
