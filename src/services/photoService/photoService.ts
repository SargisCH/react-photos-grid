import type { CuratedReturn, Photo, SearchReturn } from "../..//types/photos";
import { pexelsFetch } from "../pexelsFetch";

const ENDPOINT = {
  curated: "/curated",
  search: "/search",
  details: "/photos",
};

export const getPhotos = (page = 1): Promise<CuratedReturn> => {
  return pexelsFetch(ENDPOINT.curated, { page });
};
export const getPhotoDetails = (id: number): Promise<Photo | null> => {
  return pexelsFetch(`${ENDPOINT.details}/${id}`);
};

export const searchPhoto = (): Promise<SearchReturn> => {
  return pexelsFetch(ENDPOINT.search);
};
