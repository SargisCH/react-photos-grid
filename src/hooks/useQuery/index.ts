import { useState, useEffect, useRef, useCallback } from "react";

type QueryKey = readonly (
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
)[];

interface QueryState<TData> {
  data: TData | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface UseQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

interface UseQueryResult<TData> extends QueryState<TData> {
  refetch: () => Promise<void>;
}
export const useQuery = <TData = unknown>({
  queryKey,
  queryFn,
  onSuccess,
  onError,
}: UseQueryOptions<TData>): UseQueryResult<TData> => {
  const [state, setState] = useState<QueryState<TData>>({
    data: null,
    error: null,
    isLoading: true,
    isSuccess: false,
    isError: false,
  });

  const queryFnRef = useRef(queryFn);
  const queryKeyString = JSON.stringify(queryKey);
  const queryKeyStringRef = useRef(queryKeyString);

  // Always keep the latest queryFn
  useEffect(() => {
    queryFnRef.current = queryFn;
  }, [queryFn]);

  useEffect(() => {
    queryKeyStringRef.current = queryKeyString;
  }, [queryKeyString]);

  const fetchData = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const result = await queryFnRef.current();

      setState({
        data: result,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });

      onSuccess?.(result);
    } catch (error) {
      setState({
        data: null,
        error: error as Error,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });

      onError?.(error as Error);
    }
  }, [onSuccess, onError]);

  const refetch = useCallback(() => fetchData(), [fetchData]);

  if (
    queryFnRef.current !== queryFn &&
    queryKeyString === queryKeyStringRef.current
  ) {
    console.warn(
      `🚨 useQuery Warning: The 'queryFn' reference changed on re-render. (Possibly passed as an inline argument)
        This may cause unnecessary refetches or an infinite loop if its dependencies are unstable.
        Wrap 'queryFn' in React.useCallback() in the parent component.
        Query Key: ${queryKeyString}`,
    );
  }

  useEffect(() => {
    fetchData();
  }, [queryKeyString, fetchData]);

  return { ...state, refetch };
};
