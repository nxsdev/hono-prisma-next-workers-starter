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

3. Start the development server(s)

```bash
  cd apps/api && pnpm dev
  cd apps/web && pnpm dev
```

That's it! You should now have the API and web server running locally.

## Deploying to Cloudflare

1. Create a new GitHub repository for your project.

2. Set up the following GitHub repository secrets:

- [`CLOUDFLARE_ACCOUNT_ID`](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/)
- [`CLOUDFLARE_API_TOKEN`](https://developers.cloudflare.com/workers/wrangler/ci-cd/#api-token)

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
