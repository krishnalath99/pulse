import { useEffect, useRef, useState } from 'react';

/**
 * Returns a throttled copy of `value`. The returned value updates at most
 * once per `delay` milliseconds. The first change fires immediately;
 * subsequent changes within the throttle window are dropped, but the
 * latest pending value is delivered via a trailing-edge update once the
 * window expires.
 *
 * @param value - the value to throttle
 * @param delay - minimum milliseconds between updates
 * @returns the throttled value
 */
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // Last time we accepted an update -- persists across renders.
  const lastFireTimeRef = useRef<number>(0);

  // Pending trailing timer -- so we can clear it if needed.
  const trailingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Latest value -- read by the trailing timer when it fires.
  // We use a ref so the timer always reads the FRESH value,
  // not whatever was captured when the timer was scheduled.
  const latestValueRef = useRef<T>(value);

  // Sync the ref AFTER render commits (mutating refs during render is unsafe in concurrent React).
  useEffect(() => {
    latestValueRef.current = value;
  });

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastFireTimeRef.current;

    if (elapsed >= delay) {
      lastFireTimeRef.current = now;
      setThrottledValue(value);
    } else if (trailingTimerRef.current === null) {
      const timeUntilNextFire = delay - elapsed;
      trailingTimerRef.current = setTimeout(() => {
        lastFireTimeRef.current = Date.now();
        setThrottledValue(latestValueRef.current);
        trailingTimerRef.current = null;
      }, timeUntilNextFire);
    }
  }, [value, delay]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (trailingTimerRef.current !== null) {
        clearTimeout(trailingTimerRef.current);
      }
    };
  }, []);

  return throttledValue;
}
