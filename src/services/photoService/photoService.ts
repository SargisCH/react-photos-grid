import type { CuratedReturn, SearchReturn } from "../..//types/photos";
import { pexelsFetch } from "../pexelsFetch";

enum ENDPOINT {
  curated = "/curated",
  search = "/search",
  details = "/photos",
}

export const getPhotos = (): Promise<CuratedReturn> => {
  return pexelsFetch(ENDPOINT.curated);
};

export const searchPhoto = (): Promise<SearchReturn> => {
  return pexelsFetch(ENDPOINT.search);
};
