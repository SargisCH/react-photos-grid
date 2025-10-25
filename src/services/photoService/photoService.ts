import type { CuratedReturn, SearchReturn } from "../..//types/photos";
import { pexelsFetch } from "../pexelsFetch";

const ENDPOINT = {
  curated: "/curated",
  search: "/search",
  details: "/photos",
};

export const getPhotos = (page = 1): Promise<CuratedReturn> => {
  return pexelsFetch(ENDPOINT.curated, { page });
};

export const searchPhoto = (): Promise<SearchReturn> => {
  return pexelsFetch(ENDPOINT.search);
};
