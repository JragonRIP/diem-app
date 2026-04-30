import { useRef } from "react";

export const useLongPress = (onLongPress, ms = 500) => {
  const timerRef = useRef(null);

  const start = () => {
    timerRef.current = setTimeout(() => onLongPress?.(), ms);
  };

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
  };
};
