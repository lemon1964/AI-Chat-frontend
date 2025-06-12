import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import apiClient from "@/services/authClientService";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // console.log("authorize: received credentials:", credentials);

        if (!credentials?.email || !credentials.password) {
          console.error("authorize: Missing email or password");
          throw new Error("Email and password must be provided");
        }

        try {
          const { data } = await apiClient.post(`${baseURL}/api/auth/custom/login/`, {
            email: credentials.email,
            password: credentials.password,
          });

          // console.log("authorize: response from server:", data);

          if (data?.user) {
            const { id, name, email } = data.user;
            const accessToken = data.access || null;
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
    async signIn({ user, account }) {
      const allowedProviders = ["google", "apple"];
      if (account?.provider && allowedProviders.includes(account.provider)) {
        try {
          const res = await apiClient.post(
            `${baseURL}/api/auth/custom/oauth/register-or-login/`,
            {
              id: user.id,
              name: user.name,
              email: user.email,
              provider: account.provider,
            }
          );
          if (res.status === 200) {
            // Сохраняем токен от бэкенда
            user.accessToken = res.data.access;
            user.refreshToken = res.data.refresh;
            // console.log("OAuth response data:", res.data);
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

    async jwt({ token, user }) {
      // console.log("jwt: before updating token:", token, "user:", user);

      if (user) {
        token.id = user.id.toString();
        token.accessToken = user.accessToken || null;
        token.refreshToken = user.refreshToken || null;
      }

      // console.log("jwt: after updating token:", token);
      return token;
    },

    async session({ session, token }) {
      // console.log("session: before updating session:", session, "token:", token);

      session.user = {
        ...session.user,
        id: token.id as string,
      };
      session.accessToken = token.accessToken || null;
      session.refreshToken = token.refreshToken || null;

      // console.log("session: after updating session:", session);
      // console.log("🔐session AccessToken:", token.accessToken);
      return session;
    },
  },
});

export { handler as GET, handler as POST };
