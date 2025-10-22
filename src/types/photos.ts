import type { ErrorResponse } from ".";
import type { Pagination } from "./pagination";

export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  alt: string | null;
  avg_color: string | null;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  liked: boolean;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

export type Photos = Pagination & { photos: Photo[] };

export type PhotosWithTotalResults = Photos & { total_results: number };

export type SearchReturn = PhotosWithTotalResults | ErrorResponse;
export type CuratedReturn = Photos | ErrorResponse;
