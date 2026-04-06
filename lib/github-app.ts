import { readFile } from "fs/promises";
import path from "path";

import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function readPrivateKeyFromPath(privateKeyPath: string) {
  const resolvedPath = path.isAbsolute(privateKeyPath)
    ? privateKeyPath
    : path.join(/* turbopackIgnore: true */ process.cwd(), privateKeyPath);

  return readFile(resolvedPath, "utf8");
}

async function getGitHubAppPrivateKey() {
  const privateKeyPath = process.env.GITHUB_APP_PRIVATE_KEY_PATH?.trim();

  if (privateKeyPath) {
    return readPrivateKeyFromPath(privateKeyPath);
  }

  const privateKey = getRequiredEnv("GITHUB_APP_PRIVATE_KEY");

  // Vercel and other hosted environments often store PEM content in a single-line
  // environment variable with escaped newlines. Convert it back into valid multiline PEM.
  return privateKey.replace(/\\n/g, "\n");
}

export async function getGitHubAppInstallationOctokit() {
  const appId = Number(getRequiredEnv("GITHUB_APP_ID"));
  const installationId = Number(getRequiredEnv("GITHUB_APP_INSTALLATION_ID"));
  const privateKey = await getGitHubAppPrivateKey();

  if (!Number.isFinite(appId) || !Number.isFinite(installationId)) {
    throw new Error(
      "GITHUB_APP_ID and GITHUB_APP_INSTALLATION_ID must be valid numbers.",
    );
  }

  const auth = createAppAuth({
    appId,
    privateKey,
  });

  const installationAuthentication = await auth({
    type: "installation",
    installationId,
  });

  return new Octokit({
    auth: installationAuthentication.token,
  });
}
