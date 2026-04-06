import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

function getFallbackUsername({
  login,
  name,
  email,
}: {
  login?: string | null;
  name?: string | null;
  email?: string | null;
}) {
  if (login) {
    return login;
  }

  if (name) {
    return name.replace(/\s+/g, "-").toLowerCase();
  }

  if (email) {
    return email.split("@")[0];
  }

  return "contributor";
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, profile }) {
      const githubProfile = profile as
        | {
            login?: string | null;
            name?: string | null;
            email?: string | null;
          }
        | undefined;

      token.githubUsername = getFallbackUsername({
        login: githubProfile?.login,
        name: githubProfile?.name ?? token.name,
        email: githubProfile?.email ?? token.email,
      });

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.githubUsername =
          token.githubUsername ??
          getFallbackUsername({
            name: session.user.name,
            email: session.user.email,
          });
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return baseUrl;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
