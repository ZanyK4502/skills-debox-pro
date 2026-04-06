import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      githubUsername?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubUsername?: string;
  }
}
