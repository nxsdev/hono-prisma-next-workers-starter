import { GitHub } from 'arctic';

export function createGitHubAuth(env: CloudflareEnv) {
  return new GitHub(
    env.GITHUB_CLIENT_ID,
    env.GITHUB_CLIENT_SECRET,
    `${env.APP_URL}/auth/github/callback`,
  );
}
