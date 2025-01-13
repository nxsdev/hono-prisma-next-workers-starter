export const dynamic = 'force-dynamic';

import { client } from '@/lib/client';
import { getQueryClient } from '@/lib/get-query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import Image from 'next/image';
import { HonoLogo } from './hono-logo';
import { TasksContainer } from './task-container';

export default async function Page() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ['tasks'] as const,
    queryFn: () => client.tasks.$get().then((res) => res.json()),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto pt-16 px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6 gap-4">
              <HonoLogo className="w-11 h-11" />
              <span className="text-2xl text-gray-500">+</span>
              <Image
                src="https://skillicons.dev/icons?i=prisma,nextjs,cloudflare"
                alt="Built with Cloudflare, Prisma, Next.js"
                width={144}
                height={48}
                priority
              />
            </div>

            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-blue-500 to-blue-600 mb-4">
              Hono + Prisma + Next.js Workers Starter
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              A minimal starter template for Cloudflare Workers
            </p>
            <p className="text-gray-500">
              Built with Hono, Prisma, Next.js, and deployed on Cloudflare Workers
            </p>
          </div>
          <TasksContainer />
        </div>
      </div>
    </HydrationBoundary>
  );
}
