import { renderHook, act } from '@testing-library/react';
import { useThrottle } from './useThrottle';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Pin "now" to a known time so Date.now() is deterministic.
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useThrottle('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('fires immediately on the first change (leading edge)', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 300), {
      initialProps: { value: 'a' },
    });
    expect(result.current).toBe('a');

    rerender({ value: 'b' });
    // Within the throttle window -- 'b' should NOT be applied yet.
    expect(result.current).toBe('a');
  });

  it('drops intermediate changes within the throttle window', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 300), {
      initialProps: { value: 'a' },
    });

    // t=0: initial 'a' applied.
    rerender({ value: 'b' });
    // t=100: change to 'c'.
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: 'c' });
    expect(result.current).toBe('a'); // still throttled

    // Advance to just before trailing fire (t=299).
    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(result.current).toBe('a');

    // Trailing fire at t=300 -- delivers latest value 'c', not 'b'.
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('c');
  });

  it('accepts changes after the throttle window expires', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    // Trailing fire delivers 'b' at t=300.
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('b');

    // 400ms later (t=700, well past last fire) -- new change fires immediately.
    act(() => {
      vi.advanceTimersByTime(400);
    });
    rerender({ value: 'c' });
    expect(result.current).toBe('c');
  });
});
