import type { AppType } from '@repo/api';
import { hc } from 'hono/client';
import { APIError } from '../../lib/error';

type HonoClient = ReturnType<typeof hc<AppType>>;
export type Client = HonoClient;

export const createClient = (...args: Parameters<typeof hc>): Client => {
  const [baseUrl, init] = args;
  return hc<AppType>(baseUrl, {
    ...init,
    fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
      try {
        const response = await fetch(input, {
          ...requestInit,
          cache: 'no-store', // Next.js 14でのfetchのキャッシュを無効化
        });

        if (!response.ok) {
          let errorData: Record<string, unknown> | undefined;

          try {
            errorData = await response.json();
          } catch {
            // JSONパースに失敗した場合はundefinedのまま
          }

          throw new APIError(
            response.status,
            (errorData?.message as string) || `HTTP Error: ${response.status}`,
            errorData,
          );
        }

        return response;
      } catch (error) {
        // fetch自体が失敗した場合（ネットワークエラーなど）
        if (!(error instanceof APIError)) {
          throw new APIError(
            0, // ネットワークエラーなどの場合はステータスコード0
            'Network error occurred',
            undefined,
            error instanceof Error ? error : undefined,
          );
        }
        throw error;
      }
    },
  });
};

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

export const client = createClient('https://todos-api.nxsland.workers.dev').api.v1;
