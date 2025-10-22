import { useQuery } from "../hooks/useQuery";
import { getPhotos } from "../services/photoService/photoService";
import type { CuratedReturn } from "../types/photos";

export default function PhotoGrid() {
  useQuery<CuratedReturn>({
    queryKey: ["photos"],
    queryFn: getPhotos,
  });
  return <div>PhotoGrid</div>;
}
