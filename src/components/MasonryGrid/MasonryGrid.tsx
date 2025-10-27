import type { JSX } from "react";
import useColumns from "../../hooks/useColumns";
import useMasonryVirtualization from "../../hooks/useMasonryVirtualization";
import Loader from "../Loader";
import {
  LoaderContainer,
  MasonryColumns,
  MasonryContainer,
  StyledItem,
} from "./MasonryGrid.styled";

const COLUMN_WIDTH = 230;
const ITEM_HEIGHT = 350;
const GAP = 10;

type MasonryGridProps<T> = {
  items: T[];
  onScrollEnd?: () => void;
  columnWidth?: number;
  itemHeight?: number;
  gap?: number;
  overscan?: number;
  isLoading?: boolean;
  renderItem: (item: T) => JSX.Element;
};

export default function MasonryGrid<
  T extends {
    id: number;
    width: number;
    height: number;
    src: { medium: string };
  },
>({
  items,
  onScrollEnd,
  isLoading = false,
  columnWidth = COLUMN_WIDTH,
  itemHeight = ITEM_HEIGHT,
  gap = GAP,
  overscan = 2,
  renderItem,
}: MasonryGridProps<T>) {
  const columnCount = useColumns(columnWidth);

  const { containerRef, longestColumnHeight, visibleItems, handleScroll } =
    useMasonryVirtualization(
      items,
      columnCount,
      { columnWidth, gap, overscan, itemHeight },
      onScrollEnd,
    );
  const isInitialoading = isLoading && !items.length;
  return (
    <MasonryContainer ref={containerRef} onScroll={handleScroll}>
      <MasonryColumns
        key={columnCount}
        $height={isInitialoading ? 350 : longestColumnHeight}
        $width={columnWidth * columnCount + (columnCount - 1) * gap}
      >
        {isInitialoading ? (
          <LoaderContainer isInitialLoading={true}>
            <Loader width={COLUMN_WIDTH} />
          </LoaderContainer>
        ) : null}
        {visibleItems.map(({ item, position }) => (
          <StyledItem
            key={item.id}
            $width={columnWidth}
            $height={position?.height}
            $top={position?.top}
            $left={position?.left}
          >
            {renderItem(item)}
          </StyledItem>
        ))}
      </MasonryColumns>
      {isLoading && !isInitialoading ? (
        <LoaderContainer>
          <Loader width={COLUMN_WIDTH} />
        </LoaderContainer>
      ) : null}
    </MasonryContainer>
  );
}
//
