import { useRef } from "react";

export const useSwipe = ({ onSwipeLeft, onSwipeRight, minDistance = 50 }) => {
  const startX = useRef(0);
  const startY = useRef(0);

  const onTouchStart = (event) => {
    const touch = event.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
  };

  const onTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;

    if (Math.abs(deltaX) < minDistance || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX < 0) onSwipeLeft?.();
    if (deltaX > 0) onSwipeRight?.();
  };

  return { onTouchStart, onTouchEnd };
};
