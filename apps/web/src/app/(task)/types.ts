import type { client } from '@/lib/client';
import type { InferResponseType } from 'hono/client';

export type TaskResponse = InferResponseType<typeof client.tasks.$get>;
export type Task = TaskResponse extends (infer T)[] ? T : never;
