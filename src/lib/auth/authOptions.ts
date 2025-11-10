// src/lib/auth/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import apiClient from "@/services/authClientService";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    // [!region providers]
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Email/Password аутентификация
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Валидация полей
        if (!credentials?.email || !credentials.password) {
          console.error("authorize: Missing email or password");
          throw new Error("Email and password must be provided");
        }
        try {
          // Запрос к Django API
          const { data } = await apiClient.post(`${baseURL}/api/auth/custom/login/`, {
            email: credentials.email,
            password: credentials.password,
          });
                    // Формирование объекта пользователя
          if (data?.user) {
            const { id, name, email } = data.user;
            const accessToken = data.access || null;    // JWT от Django
            const refreshToken = data.refresh || null;
            return { id: id.toString(), name, email, accessToken, refreshToken };
          }
        } catch (err) {
          if (err instanceof Error) {
            console.error("authorize: Authorization error", err.message);
          } else {
            console.error("authorize: Authorization error", err);
          }
          throw new Error("Invalid email or password");
        }
        return null;
      },
    }),
  ],
  callbacks: {
        // Обработка OAuth-входа
    async signIn({ user, account }) {
      const allowedProviders = ["google", "apple"];
      if (account?.provider && allowedProviders.includes(account.provider)) {
        try {
                      // Синхронизация с Django
          const res = await apiClient.post(`${baseURL}/api/auth/custom/oauth/register-or-login/`, {
            id: user.id,
            name: user.name,
            email: user.email,
            provider: account.provider,
          });
          if (res.status === 200) {
            // Сохраняем токен от бэкенда
            user.accessToken = res.data.access;
            user.refreshToken = res.data.refresh;
            return true;
          } else {
            console.error("Failed to synchronize user with Django");
            return false;
          }
        } catch (err) {
          console.error("Error while synchronizing user with Django", err);
          return false;
        }
      }
      return true;
    },
    // Формирование JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id.toString();
        token.accessToken = user.accessToken || null;
        token.refreshToken = user.refreshToken || null;
      }
      return token;
    },
    // Формирование сессии
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
      };
      session.accessToken = token.accessToken || null;
      session.refreshToken = token.refreshToken || null;
      return session;
    },
  },
};
