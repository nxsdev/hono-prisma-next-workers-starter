import tasks from '@/app/task/routes/task.index';
import configureOpenAPI from '@/lib/configure-open-api';
import createApp from '@/lib/create-app';
import { cors } from 'hono/cors';

const app = createApp();

configureOpenAPI(app);

app.use(
  '/api/v1/*',
  cors({
    origin: 'https://todos-web.nxsland.workers.dev',
    allowMethods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

// app.basePath('api/v1').route('/', tasks); basePathを使うとOASが出力されないので直書き
const routes = app.route('api/v1/', tasks);

export type AppType = typeof routes;

export default app;
