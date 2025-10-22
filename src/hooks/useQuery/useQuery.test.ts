import { describe, it, expect, vi, beforeEach, don } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuery } from "./index";

const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

const mockQueryFn = vi.fn();
const mockOnSuccess = vi.fn();
const mockOnError = vi.fn();

const successfulData = { result: "data fetched successfully" };
const mockError = new Error("Failed to fetch data");

describe("useQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    consoleWarnSpy.mockClear();
    mockQueryFn.mockResolvedValue(successfulData);
  });

  // ----------------------------------------------------------------------
  // TEST 1: Initial State and Immediate Fetch
  // ----------------------------------------------------------------------
  it("should start in loading state and immediately call queryFn", () => {
    const { result } = renderHook(() =>
      useQuery({ queryKey: ["photos"], queryFn: mockQueryFn }),
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(mockQueryFn).toHaveBeenCalledTimes(1);
  });

  // ----------------------------------------------------------------------
  // TEST 2: Successful Fetch
  // ----------------------------------------------------------------------
  it("should transition to success state and run onSuccess after successful fetch", async () => {
    const { result } = renderHook(() =>
      useQuery({
        queryKey: ["photos"],
        queryFn: mockQueryFn,
        onSuccess: mockOnSuccess,
      }),
    );

    await act(async () => {
      await new Promise(process.nextTick);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toEqual(successfulData);

    expect(mockOnSuccess).toHaveBeenCalledWith(successfulData);
    expect(mockOnError).not.toHaveBeenCalled();
  });

  // ----------------------------------------------------------------------
  // TEST 3: Failed Fetch
  // ----------------------------------------------------------------------
  it("should transition to error state and run onError after failed fetch", async () => {
    mockQueryFn.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() =>
      useQuery({
        queryKey: ["test-error"],
        queryFn: mockQueryFn,
        onError: mockOnError,
      }),
    );

    // Wait for the asynchronous fetch operation to complete
    await act(async () => {
      await new Promise(process.nextTick);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(mockError);

    expect(mockOnError).toHaveBeenCalledWith(mockError);
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  // ----------------------------------------------------------------------
  // TEST 4: Manual Refetch
  // ----------------------------------------------------------------------
  it("should refetch data and update state when refetch is called", async () => {
    const initialData = { initial: true };
    const refetchedData = { refetched: true };

    mockQueryFn.mockResolvedValueOnce(initialData);
    mockQueryFn.mockResolvedValueOnce(refetchedData);

    const { result } = renderHook(() =>
      useQuery({ queryKey: ["refetch-test"], queryFn: mockQueryFn }),
    );

    await act(async () => {
      await new Promise(process.nextTick);
    });
    expect(mockQueryFn).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(initialData);

    await act(async () => {
      result.current.refetch();
    });

    expect(mockQueryFn).toHaveBeenCalledTimes(2);
    expect(result.current.data).toEqual(refetchedData);
    expect(result.current.isLoading).toBe(false);
  });

  // ----------------------------------------------------------------------
  // TEST 5: Query Key Change
  // ----------------------------------------------------------------------
  it("should trigger a new fetch when queryKey changes", async () => {
    const key1Data = { key: 1 };
    const key2Data = { key: 2 };

    mockQueryFn.mockResolvedValueOnce(key1Data);
    mockQueryFn.mockResolvedValueOnce(key2Data);

    const { result, rerender } = renderHook(
      ({ key }) => useQuery({ queryKey: [key], queryFn: mockQueryFn }),
      { initialProps: { key: "key-1" } },
    );

    await act(async () => {
      await new Promise(process.nextTick);
    });
    expect(mockQueryFn).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(key1Data);

    rerender({ key: "key-2" });

    // 3. Wait for second fetch (key-2)
    await act(async () => {
      await new Promise(process.nextTick);
    });

    expect(mockQueryFn).toHaveBeenCalledTimes(2);
    expect(result.current.data).toEqual(key2Data);
  });

  // ----------------------------------------------------------------------
  // TEST 6: Unstable Function Warning (The core instability check)
  // ----------------------------------------------------------------------
  it("should emit a console warning if queryFn changes but queryKey is stable", async () => {
    const stableKey = ["stable-key"];

    const { rerender } = renderHook(
      ({ fn }) => useQuery({ queryKey: stableKey, queryFn: fn }),
      { initialProps: { fn: mockQueryFn } },
    );

    await act(async () => {
      await new Promise(process.nextTick);
    });

    expect(consoleWarnSpy).not.toHaveBeenCalled();

    const unstableQueryFn = vi.fn().mockResolvedValue(successfulData);
    rerender({ fn: unstableQueryFn });

    await act(async () => {
      await new Promise(process.nextTick);
    });

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy.mock.calls[0][0]).toContain(
      "useQuery Warning: The 'queryFn' reference changed on re-render",
    );
  });
});
