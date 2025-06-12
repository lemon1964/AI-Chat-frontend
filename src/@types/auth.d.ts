// import NextAuth from "next-auth";
import { InternalAxiosRequestConfig } from "axios";

export interface AuthAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      accessToken?: string | null;
    };
    accessToken?: token.accessToken | null;
    refreshToken?: token.refreshToken | null;
}

  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    accessToken?: string | null;
    refreshToken?: string | null;
  }
}
