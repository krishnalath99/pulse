import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('does not update before the delay has passed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'first' },
    });

    expect(result.current).toBe('first');

    rerender({ value: 'second' });
    expect(result.current).toBe('first'); // not updated yet

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('first'); // still not yet

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('second'); // updated at exactly 300ms
  });

  it('resets the timer when value changes again', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a'); // partway through, not yet updated

    rerender({ value: 'c' }); // new value -- timer resets
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a'); // still not updated; only 200ms since 'c'

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('c'); // 300ms after 'c', finally updates
  });
});
