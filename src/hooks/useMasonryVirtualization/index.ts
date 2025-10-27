import { useEffect, useRef, useState } from "react";

type MasonryItem = {
  id: number;
  width: number;
  height: number;
};

type Position = {
  top: number;
  left: number;
  height: number;
};

type Column = {
  height: number;
  items: number[];
};

type UseMasonryOptions = {
  columnWidth: number;
  itemHeight: number;
  gap?: number;
  overscan?: number;
};

type UseMasonryResult<T> = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  positions: Position[];
  longestColumnHeight: number;
  visibleItems: Array<{
    item: T;
    position: Position;
    index: number;
  }>;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
};

const calculateItemHeight = (
  width: number,
  height: number,
  targetWidth: number,
): number => {
  const widthQuotient = targetWidth / width;
  return widthQuotient * height;
};

const getStartIndex = (
  positions: Position[],
  scrollTop: number,
  columnCount: number,
): number => {
  if (!scrollTop || positions.length === 0) return 0;

  for (let i = 0; i < positions.length; i++) {
    if (positions[i].top > scrollTop) {
      return Math.max(i - columnCount * 2, 0);
    }
  }
  return 0;
};

const getColumnsInitialValue = (columnCount: number) =>
  Array.from(
    { length: columnCount },
    (): { height: number; items: number[] } => ({
      height: 0,
      items: [],
    }),
  );

export default function useMasonryVirtualization<T extends MasonryItem>(
  items: T[],
  columnCount: number,
  options: UseMasonryOptions,
  onScrollEnd?: () => void,
): UseMasonryResult<T> {
  const { columnWidth, gap = 10, overscan = 2, itemHeight } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [positions, setPositions] = useState<Position[]>([]);
  const [longestColumnHeight, setLongestColumnHeight] = useState(0);
  const scrollRef = useRef<number | null>(null);
  const itemsLengthRef = useRef(0);
  const columnsRef = useRef<Column[]>(getColumnsInitialValue(columnCount));
  const scrollEndTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  // Reset when column count changes
  useEffect(() => {
    columnsRef.current = getColumnsInitialValue(columnCount);
    setPositions([]);
    setLongestColumnHeight(0);
    itemsLengthRef.current = 0;
  }, [columnCount]);

  // Calculate positions for new items
  useEffect(() => {
    const positionsTemp: Position[] = [];
    const addedItemsLength = items.length - itemsLengthRef.current;
    const addedItemsFirstIndex = items.length - addedItemsLength;
    for (let i = addedItemsFirstIndex; i < items.length; i++) {
      const item = items[i];

      // Find shortest column
      const shortestColumnIndex = columnsRef.current.reduce(
        (shortest, col, idx) =>
          col.height < columnsRef.current[shortest].height ? idx : shortest,
        0,
      );

      const shortestCol = columnsRef.current[shortestColumnIndex];
      const itemHeight = calculateItemHeight(
        item.width,
        item.height,
        columnWidth,
      );
      positionsTemp.push({
        top: shortestCol.height,
        left: shortestColumnIndex * (columnWidth + gap),
        height: itemHeight,
      });

      shortestCol.height += itemHeight + gap;
      shortestCol.items.push(i);
    }

    const longestColumn = Math.max(...columnsRef.current.map((c) => c.height));

    itemsLengthRef.current = items.length;
    setLongestColumnHeight(longestColumn);
    setPositions((prev) => [...prev, ...positionsTemp]);
  }, [items, columnCount, columnWidth, gap]);
  // Calculate visible items
  const startIndex = getStartIndex(positions, scrollTop, columnCount);
  const endIndex = items.length
    ? startIndex +
      (containerRef.current
        ? Math.ceil(containerRef.current.offsetHeight / itemHeight) *
          columnCount
        : 0) +
      columnCount * overscan
    : 0;

  const visibleItems = [];
  if (items.length) {
    for (let i = startIndex; i <= endIndex; i++) {
      if (!items[i]) break;
      visibleItems.push({
        item: items[i],
        position: positions[i],
        index: i,
      });
    }
  }
  // Scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const tolerance = 2;
    const isScrollEnded =
      target.scrollTop + target.offsetHeight >= target.scrollHeight - tolerance;
    const currentScrollTop = target.scrollTop;

    if (scrollRef.current) {
      cancelAnimationFrame(scrollRef.current);
    }

    scrollRef.current = requestAnimationFrame(() => {
      setScrollTop(currentScrollTop);
    });

    if (isScrollEnded) {
      clearTimeout(scrollEndTimeout.current ?? -1);
      scrollEndTimeout.current = setTimeout(() => {
        onScrollEnd?.();
      }, 200);
    }
  };

  return {
    containerRef,
    positions,
    longestColumnHeight,
    visibleItems,
    handleScroll,
  };
}
