import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { getPhotos, searchPhoto } from "./photoService";

vi.mock("../pexelsFetch", () => ({
  pexelsFetch: vi.fn(),
}));

import { pexelsFetch } from "../pexelsFetch";

const MOCK_PHOTO = {
  id: 123,
  width: 1000,
  height: 600,
  url: "http://example.com/photo/123",
  alt: "A beautiful mock image",
  avg_color: "#FFFFFF",
  photographer: "Mock Photographer",
  photographer_url: "http://example.com/photographer/mock",
  photographer_id: 42,
  liked: false,
  src: {
    original: "http://example.com/original",
    large2x: "http://example.com/large2x",
    large: "http://example.com/large",
    medium: "http://example.com/medium",
    small: "http://example.com/small",
    portrait: "http://example.com/portrait",
    landscape: "http://example.com/landscape",
    tiny: "http://example.com/tiny",
  },
};

const MOCK_CURATED_RESPONSE = {
  page: 1,
  per_page: 15,
  photos: [MOCK_PHOTO],
  prev_page: undefined,
  next_page: "http://example.com/page=2",
};

const MOCK_SEARCH_RESPONSE = {
  ...MOCK_CURATED_RESPONSE,
  total_results: 999,
};

describe("Photo API Functions", () => {
  beforeEach(() => {
    (pexelsFetch as Mock).mockClear();
  });

  // ----------------------------------------------------------------------
  // TEST: getPhotos (Curated)
  // ----------------------------------------------------------------------

  describe("getPhotos", () => {
    it("should call pexelsFetch with the curated endpoint", async () => {
      (pexelsFetch as Mock).mockResolvedValueOnce(MOCK_CURATED_RESPONSE);
      await getPhotos();
      expect(pexelsFetch).toHaveBeenCalledWith("/curated");
      expect(pexelsFetch).toHaveBeenCalledTimes(1);
    });

    it("should return the data resolved by pexelsFetch", async () => {
      (pexelsFetch as Mock).mockResolvedValueOnce(MOCK_CURATED_RESPONSE);
      const result = await getPhotos();
      expect(result).toEqual(MOCK_CURATED_RESPONSE);
    });
  });

  // ----------------------------------------------------------------------
  // TEST: searchPhoto
  // ----------------------------------------------------------------------

  describe("searchPhoto", () => {
    it("should call pexelsFetch with the search endpoint", async () => {
      (pexelsFetch as Mock).mockResolvedValueOnce(MOCK_SEARCH_RESPONSE);
      await searchPhoto();
      expect(pexelsFetch).toHaveBeenCalledWith("/search");
      expect(pexelsFetch).toHaveBeenCalledTimes(1);
    });

    it("should return the data resolved by pexelsFetch", async () => {
      (pexelsFetch as Mock).mockResolvedValueOnce(MOCK_SEARCH_RESPONSE);
      const result = await searchPhoto();
      expect(result).toEqual(MOCK_SEARCH_RESPONSE);
      expect(result).toHaveProperty("total_results", 999);
    });
  });
});
