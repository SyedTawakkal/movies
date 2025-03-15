import { useState, useEffect } from "react";

function useCustomDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  //   console.log(value, "HERE");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  //   console.log("RETURNING FROM DEBOUNCE", debouncedValue);
  return debouncedValue;
}

export default useCustomDebounce;
