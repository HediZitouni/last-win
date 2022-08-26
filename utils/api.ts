import { HTTP_METHODS, API_ADRESS } from "./constants";

export async function callApi(method: string, url: string, body?: Object, params?: string[][]) {
  return await fetch(
    `${API_ADRESS}${url}${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
    getFetchParams(method, body)
  );
}

function getFetchParams(method: string, body?: Object) {
  const fetchParams = { method };
  if (method === HTTP_METHODS.GET) {
    return fetchParams;
  }
  return {
    ...fetchParams,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Headers": "origin" },
    body: JSON.stringify(body),
  };
}
