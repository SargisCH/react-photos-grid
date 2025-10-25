import { useState, useEffect } from "react";

const getWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const getColumnsCount = (columnWidth: number) => {
  const viewportWidth = getWidth() - 16; //body margin;
  return Math.floor(viewportWidth / (columnWidth + 10));
};

export default function useColumns(columnWidth: number) {
  const [columnCount, setCoumnCount] = useState<number>(
    getColumnsCount(columnWidth),
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setCoumnCount(getColumnsCount(columnWidth));
      }, 150);
    };
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [columnWidth]);

  return columnCount;
}
