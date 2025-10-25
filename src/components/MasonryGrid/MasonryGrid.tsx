import useColumns from "../../hooks/useColumns";
import useMasonryVirtualization from "../../hooks/useMasonryVirtualization";
import {
  MasonryColumns,
  MasonryContainer,
  StyledItem,
} from "./MasonryGrid.styled";

const COLUMN_WIDTH = 230;
const GAP = 10;

type MasonryGridProps<T> = {
  items: T[];
  onScrollEnd?: () => void;
  columnWidth?: number;
  gap?: number;
  overscan?: number;
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
  columnWidth = COLUMN_WIDTH,
  gap = GAP,
  overscan = 2,
}: MasonryGridProps<T>) {
  const columnCount = useColumns(columnWidth);

  const { containerRef, longestColumnHeight, visibleItems, handleScroll } =
    useMasonryVirtualization(
      items,
      columnCount,
      { columnWidth, gap, overscan },
      onScrollEnd,
    );
  return (
    <MasonryContainer ref={containerRef} onScroll={handleScroll}>
      <MasonryColumns
        key={columnCount}
        $height={longestColumnHeight}
        $width={columnWidth * columnCount + (columnCount - 1) * gap}
      >
        {visibleItems.map(({ item, position }) => (
          <StyledItem
            key={item.id}
            $width={columnWidth}
            $height={position?.height}
            $top={position?.top}
            $left={position?.left}
          >
            <img src={item.src.medium} alt={`${item.id.toString()} photo`} />
          </StyledItem>
        ))}
      </MasonryColumns>
    </MasonryContainer>
  );
}
