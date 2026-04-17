const DEFAULT_CMS_URL = "http://localhost:1337";
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? process.env.CMS_URL ?? DEFAULT_CMS_URL;
const DEFAULT_REVALIDATE_SECONDS = 60;

export type CmsFetchOptions = RequestInit & {
  revalidate?: number | false;
};

export function buildStrapiUrl(path: string): string {
  const normalizedBaseUrl = CMS_URL.endsWith("/") ? CMS_URL.slice(0, -1) : CMS_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

export async function fetchPublished<T>(
  path: string,
  options: CmsFetchOptions = {},
): Promise<T> {
  const { headers, revalidate = DEFAULT_REVALIDATE_SECONDS, ...init } = options;
  const requestInit: RequestInit = {
    ...init,
    headers: {
      accept: "application/json",
      ...headers,
    },
  };

  if (revalidate === false) {
    requestInit.cache = "no-store";
  } else {
    requestInit.next = { revalidate };
  }

  const response = await fetch(buildStrapiUrl(path), requestInit);

  if (!response.ok) {
    throw new Error(`CMS fetch failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
