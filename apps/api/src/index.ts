import tasks from '@/app/task/routes/task.index';
import configureOpenAPI from '@/lib/configure-open-api';
import createApp from '@/lib/create-app';
import { cors } from 'hono/cors';

const app = createApp();

configureOpenAPI(app);

app.use(
  '*',
  cors({
    origin: ['https://todos-web.nxsland.workers.dev', 'http://localhost:8771'],
    allowMethods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header', 'Upgrade-Insecure-Requests'],
    credentials: true,
  }),
);

// app.basePath('api/v1').route('/', tasks); basePathを使うとOASが出力されないので直書き
const routes = app.route('/', tasks);

export type AppType = typeof routes;

export default app;
