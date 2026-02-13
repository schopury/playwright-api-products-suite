import type { APIRequestContext, APIResponse } from '@playwright/test';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  data?: unknown;
};

export type ApiResponseResult<T = unknown> = {
  status: number;
  ok: boolean;
  headers: Record<string, string>;
  body: T;
};

function normalizeParams(
  params?: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined;

  const normalized: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) normalized[key] = value;
  }
  return Object.keys(normalized).length ? normalized : undefined;
}

async function parseJson<T>(res: APIResponse): Promise<unknown> {
  if (res.status() === 204) {
    return null;
  }

  const contentType = res.headers()['content-type'] ?? '';
  const text = await res.text().catch(() => 'unable to read body');

  if (!contentType.includes('application/json')) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Failed to parse JSON. Status=${res.status()} Body=${text}`);
  }
}

export async function apiRequest<T = unknown>(
  request: APIRequestContext,
  method: HTTPMethod,
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponseResult<T>> {
  const response = await request.fetch(path, {
    method,
    params: normalizeParams(options.params),
    data: options.data,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return {
    status: response.status(),
    ok: (await response).ok(),
    headers: response.headers(),
    body: (await parseJson(response)) as T,
  };
}
