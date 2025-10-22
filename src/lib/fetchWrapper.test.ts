import { describe, it, expect, vi, beforeEach } from "vitest";
import createFetchWrapper from "./fetchWrapper";

const fetchMock = vi.fn();
global.fetch = fetchMock;

const mockSuccessResponse = (data: any, status = 200) =>
  Promise.resolve({
    ok: true,
    status: status,
    statusText: "OK",
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response);

const mockErrorResponse = (
  status = 500,
  statusText = "Internal Server Error",
) =>
  Promise.resolve({
    ok: false,
    status: status,
    statusText: statusText,
    json: () => Promise.reject(new Error(statusText)),
    text: () => Promise.resolve(statusText),
  } as Response);

describe("createFetchWrapper", () => {
  const BASE_URL = "https://api.example.com";
  const API_KEY = "Bearer example-token";
  let fetchWrapper: ReturnType<typeof createFetchWrapper>;

  beforeEach(() => {
    fetchMock.mockClear();
    fetchWrapper = createFetchWrapper(BASE_URL, API_KEY);
  });

  // --------------------------------------------------------------------------
  // TEST: Wrapper Initialization and Default Options
  // --------------------------------------------------------------------------

  it("should initialize with correct default headers and authorization", async () => {
    const MOCK_DATA = { id: 1, name: "Test" };
    fetchMock.mockReturnValueOnce(mockSuccessResponse(MOCK_DATA));

    await fetchWrapper("/users");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/users?`,
      expect.objectContaining({
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: API_KEY,
        },
      }),
    );
  });

  // --------------------------------------------------------------------------
  // TEST: Successful Fetch and JSON Parsing
  // --------------------------------------------------------------------------

  it("should successfully fetch data and return the parsed JSON", async () => {
    const MOCK_DATA = { count: 3, items: ["a", "b", "c"] };
    fetchMock.mockReturnValueOnce(mockSuccessResponse(MOCK_DATA));

    const result = await fetchWrapper("/items");

    expect(result).toEqual(MOCK_DATA);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  // --------------------------------------------------------------------------
  // TEST: Query Parameter Handling
  // --------------------------------------------------------------------------

  it("should correctly stringify and append query parameters", async () => {
    const MOCK_DATA = { result: true };
    fetchMock.mockReturnValueOnce(mockSuccessResponse(MOCK_DATA));

    const params = {
      limit: 10,
      page: 2,
      sort: "name",
    };

    await fetchWrapper("/products", params);

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/products?limit=10&page=2&sort=name`,
      expect.anything(),
    );
  });

  // --------------------------------------------------------------------------
  // TEST: Error Handling
  // --------------------------------------------------------------------------

  it("should throw an error for non-ok responses (404)", async () => {
    const ERROR_TEXT = "Not Found";
    fetchMock.mockReturnValueOnce(mockErrorResponse(404, ERROR_TEXT));

    // We expect the function to throw when the promise resolves
    await expect(fetchWrapper("/missing")).rejects.toThrow(ERROR_TEXT);
  });

  it("should throw an error for non-ok responses (500)", async () => {
    const ERROR_TEXT = "Internal Server Error";
    fetchMock.mockReturnValueOnce(mockErrorResponse(500, ERROR_TEXT));

    await expect(fetchWrapper("/error")).rejects.toThrow(ERROR_TEXT);
  });
});
