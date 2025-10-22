interface Params {
  [key: string]: string | number | undefined;
}
export default function createFetchWrapper(baseUrl: string, apiKey: string) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
  };

  return <T extends Params>(path: string, params?: T) =>
    fetch(`${baseUrl}${path}?${stringifyParams(params || {})}`, options).then(
      (response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      },
    );
}

function stringifyParams<T extends Params>(params: T) {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
}
