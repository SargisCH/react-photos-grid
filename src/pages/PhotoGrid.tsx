import { useCallback, useState } from "react";
import MasonryGrid from "../components/MasonryGrid/";
import { useQuery } from "../hooks/useQuery";
import { getPhotos } from "../services/photoService/photoService";
import type { CuratedReturn } from "../types/photos";

export default function PhotoGrid() {
  const [page, setPage] = useState(1);
  const getPhotosCallback = useCallback(() => {
    return getPhotos(page);
  }, [page]);

  const { data, isLoading } = useQuery<CuratedReturn>({
    queryKey: ["photos", page],
    queryFn: getPhotosCallback,
    keepPreviousData: (prevData, newData) => ({
      ...prevData,
      photos: [...prevData.photos, ...newData.photos],
    }),
  });

  const photos = data?.photos ?? [];

  return (
    <MasonryGrid
      items={photos}
      onScrollEnd={() => {
        setPage(page + 1);
      }}
      columnWidth={250}
      gap={15}
      overscan={3}
      isLoading={isLoading}
    />
  );
}
