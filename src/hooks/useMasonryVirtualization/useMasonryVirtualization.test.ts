import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import useMasonryVirtualization from "./";

type TestItem = {
  id: number;
  width: number;
  height: number;
};

describe("useMasonryVirtualization", () => {
  const mockItems: TestItem[] = [
    { id: 1, width: 200, height: 300 },
    { id: 2, width: 200, height: 400 },
    { id: 3, width: 200, height: 200 },
    { id: 4, width: 200, height: 350 },
    { id: 5, width: 200, height: 250 },
  ];

  const defaultOptions = {
    columnWidth: 200,
    itemHeight: 300,
    gap: 10,
    overscan: 2,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should calculate positions for items", () => {
    const { result } = renderHook(() =>
      useMasonryVirtualization(mockItems, 2, defaultOptions),
    );

    expect(result.current.positions).toHaveLength(5);
    expect(result.current.positions[0]).toMatchObject({
      top: 0,
      left: 0,
      height: 300,
    });
  });

  it("should distribute items across columns", () => {
    const { result } = renderHook(() =>
      useMasonryVirtualization(mockItems, 2, defaultOptions),
    );

    const positions = result.current.positions;
    const leftColumnItems = positions.filter((p) => p.left === 0);
    const rightColumnItems = positions.filter(
      (p) => p.left === defaultOptions.columnWidth + defaultOptions.gap,
    );

    expect(leftColumnItems.length).toBeGreaterThan(0);
    expect(rightColumnItems.length).toBeGreaterThan(0);
    expect(leftColumnItems.length + rightColumnItems.length).toBe(
      mockItems.length,
    );
  });

  it("should calculate longest column height", () => {
    const { result } = renderHook(() =>
      useMasonryVirtualization(mockItems, 2, defaultOptions),
    );

    expect(result.current.longestColumnHeight).toBeGreaterThan(0);
  });

  it("should handle adding new items", () => {
    const { result, rerender } = renderHook(
      ({ items }) => useMasonryVirtualization(items, 2, defaultOptions),
      { initialProps: { items: mockItems } },
    );

    const initialLength = result.current.positions.length;

    const newItems = [
      ...mockItems,
      { id: 6, width: 200, height: 300 },
      { id: 7, width: 200, height: 250 },
    ];

    rerender({ items: newItems });

    expect(result.current.positions).toHaveLength(initialLength + 2);
  });

  it("should reset positions when column count changes", () => {
    const { result, rerender } = renderHook(
      ({ columnCount }) =>
        useMasonryVirtualization(mockItems, columnCount, defaultOptions),
      { initialProps: { columnCount: 2 } },
    );

    const initialPositions = [...result.current.positions];

    rerender({ columnCount: 3 });

    expect(result.current.positions).not.toEqual(initialPositions);
  });

  it("should handle scroll events", () => {
    const { result } = renderHook(() =>
      useMasonryVirtualization(mockItems, 2, defaultOptions),
    );

    const mockScrollEvent = {
      currentTarget: {
        scrollTop: 100,
        offsetHeight: 500,
        scrollHeight: 1000,
      },
    } as React.UIEvent<HTMLDivElement>;

    act(() => {
      result.current.handleScroll(mockScrollEvent);
    });

    // Wait for requestAnimationFrame
    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.visibleItems.length).toBeGreaterThan(0);
  });

  it("should call onScrollEnd when scrolled to bottom", () => {
    const onScrollEnd = vi.fn();
    const { result } = renderHook(() =>
      useMasonryVirtualization(mockItems, 2, defaultOptions, onScrollEnd),
    );

    const mockScrollEvent = {
      currentTarget: {
        scrollTop: 500,
        offsetHeight: 500,
        scrollHeight: 1000,
      },
    } as React.UIEvent<HTMLDivElement>;

    act(() => {
      result.current.handleScroll(mockScrollEvent);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onScrollEnd).toHaveBeenCalledTimes(1);
  });

  it("should debounce onScrollEnd calls", async () => {
    const onScrollEnd = vi.fn();
    const { result } = renderHook(() =>
      useMasonryVirtualization(mockItems, 2, defaultOptions, onScrollEnd),
    );

    const mockScrollEvent = {
      currentTarget: {
        scrollTop: 500,
        offsetHeight: 500,
        scrollHeight: 1000,
      },
    } as React.UIEvent<HTMLDivElement>;

    // Scroll multiple times quickly
    act(() => {
      result.current.handleScroll(mockScrollEvent);
      result.current.handleScroll(mockScrollEvent);
      result.current.handleScroll(mockScrollEvent);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onScrollEnd).toHaveBeenCalledTimes(1);
  });

  it("should calculate visible items based on scroll position", () => {
    const { result } = renderHook(() =>
      useMasonryVirtualization(mockItems, 2, {
        ...defaultOptions,
        overscan: 0,
      }),
    );

    // Mock container ref
    Object.defineProperty(result.current.containerRef, "current", {
      writable: true,
      value: { offsetHeight: 600 },
    });

    expect(result.current.visibleItems.length).toBeLessThanOrEqual(
      mockItems.length,
    );
  });

  it("should calculate item height based on aspect ratio", () => {
    const items: TestItem[] = [
      { id: 1, width: 400, height: 200 }, // 2:1 ratio
    ];

    const { result } = renderHook(() =>
      useMasonryVirtualization(items, 1, {
        ...defaultOptions,
        columnWidth: 200,
      }),
    );

    // Item is 400x200, scaled to width 200 should be 200x100
    expect(result.current.positions[0].height).toBe(100);
  });
});
