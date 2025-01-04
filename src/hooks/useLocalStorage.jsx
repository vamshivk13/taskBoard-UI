import React, { useState } from "react";

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialValue);

  function setLocalStorageValue(val) {
    if (typeof val == "function") {
      setValue((prev) => {
        localStorage.setItem(key, val(prev));
        return val(prev);
      });
    } else {
      localStorage.setItem(key, val);
      setValue(val);
    }
  }
  return { value, setLocalStorageValue };
};

export default useLocalStorage;
