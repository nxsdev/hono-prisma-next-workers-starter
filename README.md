# Cloudflare Quickstart

> [!WARNING]
> This project is currently under development and not available for use.

This project is a quickstart for using Cloudflare Workers with Hono and Next.js.

The quickstart includes some defaults for:

- A monorepo architecture using pnpm workspaces and [Turborepo](https://turbo.build/repo/docs) for efficient build orchestration
- Basic Next.js 15 App Router setup with [Tailwind CSS](https://tailwindcss.com/)
- Client-side data fetching and caching via [TanStack Query](https://tanstack.com/query/latest)
- Simple and type-safe API endpoints with [Hono](https://hono.dev) and [Prisma](https://www.prisma.io/)
- Distributed SQL database with [TiDB](https://pingcap.co.jp/) for cloud-native applications
- Deployments to Cloudflare via [GitHub Actions](.github/workflows)
- Formatting and linting via [Biome](https://biomejs.dev/)

## Getting Started

1. Clone this repository

```bash
git clone git@github.com:nxsdev/hono-prisma-next-workers-starter.git
```

2. Install dependencies

```bash
pnpm install
```

3. Initialize the project

```bash
make init
```

4. Configure the database connection

Set up your TiDB database URL in apps/api/.dev.vars:

```bash
DATABASE_URL="mysql://user:password@host:4000/database_name"
```

Get started with [TiDB Cloud](https://tidbcloud.com/free-trial/) by signing up for a free tier account.

For instructions on how to get the Prisma connection URL, please refer to the [TiDB Cloud documentation](https://docs.pingcap.com/ja/tidbcloud/dev-guide-sample-application-nodejs-prisma#step-3-provide-connection-parameters).

Run database migrations

```bash
cd apps/api
pnpm prisma:migrate
```

5. Start the development server(s)

in root directory:

```bash
pnpm dev:worker
```

That's it! You should now have the API and web server running locally.

> [!NOTE]
> `pnpm dev:worker` runs Next.js on Miniflare, which is closer to the production environment, while `pnpm dev` runs it on Node.js. Use `pnpm dev` if you prioritize your development experience.

## Deploying to Cloudflare

ここより下は準備中

3. Create the Cloudflare Pages app with a project name matching that in [build-and-deploy--web.yml](.github/workflows/build-and-deploy--web.yml). You can create a new Pages app by:

- Go to Workers & Pages in Cloudflare
- Click the Pages tab and then `Upload assets`
- Type the project name and click `Create Project`, skip the rest

4. Push your repository to GitHub. The GitHub Actions workflow is set to manual trigger by default, so navigate to Actions to run the deploys manually.

### Using Custom Domains

To use a custom domain with Cloudflare Pages, you can follow the [official documentation](https://developers.cloudflare.com/pages/configuration/custom-domains/).

For the API, you can uncomment the routes snippet in [wrangler.toml](apps/api/wrangler.toml) and add your custom domain.

**Note**: This assumes your domain is already set up in Cloudflare.

## Links

- [Biome](https://biomejs.dev/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare next-on-pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-nextjs-site/)
- [Hono](https://hono.dev)
- [Next.js](https://nextjs.org)
